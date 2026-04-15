import { NextRequest } from "next/server";
import { z } from "zod";
import { runPipeline, PipelineError } from "@/lib/pipeline";
import { PersonaSchema } from "@/lib/schema";
import { normaliseCompanyInput } from "@/lib/normalise";
import { checkRateLimit, getIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 120;

const InputSchema = z.object({
  companyInput: z
    .string()
    .min(1, "companyInput is required")
    .max(200, "companyInput too long"),
  persona: PersonaSchema.default("marketing"),
});

const RESULT_DELIM = "\n---RESULT---\n";
const ERROR_DELIM = "\n---ERROR---\n";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "invalid_input",
        details: parsed.error.issues.map((i) => i.message),
      },
      { status: 400 }
    );
  }

  const normalised = normaliseCompanyInput(parsed.data.companyInput);
  if (!normalised.ok) {
    return Response.json(
      { error: "invalid_input", code: normalised.code },
      { status: 400 }
    );
  }

  const ip = getIp(req.headers);
  const rl = await checkRateLimit(ip);
  if (!rl.ok) {
    return Response.json(
      {
        error: "rate_limit",
        retryAfterSec: rl.retryAfterSec,
        resetAt: rl.resetAt,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfterSec),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rl.resetAt),
        },
      }
    );
  }

  const { persona } = parsed.data;
  const companyInput = normalised.value;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const abortController = new AbortController();
      req.signal.addEventListener("abort", () => abortController.abort());

      try {
        const result = await runPipeline({
          companyInput,
          persona,
          signal: abortController.signal,
          onChunk: (chunk) => {
            controller.enqueue(encoder.encode(chunk.text));
          },
          onProvider: (provider) => {
            controller.enqueue(
              encoder.encode(`\n---PROVIDER:${provider}---\n`)
            );
          },
        });

        controller.enqueue(
          encoder.encode(
            `${RESULT_DELIM}${JSON.stringify({
              ok: true,
              lp: result.lp,
              provider: result.provider,
              latencyMs: result.latencyMs,
              rateLimit: { remaining: rl.remaining, resetAt: rl.resetAt },
            })}\n`
          )
        );
        controller.close();
      } catch (err) {
        const pipelineErr = err instanceof PipelineError ? err : null;
        const code = pipelineErr?.code ?? "unknown";
        const errorPayload = {
          ok: false,
          code,
          message: pipelineErr?.message ?? (err as Error).message,
          providerErrors: pipelineErr?.providerErrors,
        };
        controller.enqueue(
          encoder.encode(`${ERROR_DELIM}${JSON.stringify(errorPayload)}\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "X-RateLimit-Remaining": String(rl.remaining),
      "X-RateLimit-Reset": String(rl.resetAt),
    },
  });
}
