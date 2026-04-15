import { NextRequest } from "next/server";
import { z } from "zod";
import { runPipeline, PipelineError } from "@/lib/pipeline";

export const runtime = "nodejs";
export const maxDuration = 120;

const InputSchema = z.object({
  companyInput: z
    .string()
    .min(1, "companyInput is required")
    .max(200, "companyInput too long"),
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

  const { companyInput } = parsed.data;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const abortController = new AbortController();
      req.signal.addEventListener("abort", () => abortController.abort());

      try {
        const result = await runPipeline({
          companyInput,
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
            })}\n`
          )
        );
        controller.close();
      } catch (err) {
        const pipelineErr = err instanceof PipelineError ? err : null;
        const errorPayload = {
          ok: false,
          code: pipelineErr?.code ?? "unknown",
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
    },
  });
}
