import { LPSchema, type LP, type Persona } from "@/lib/schema";
import { streamAnthropic, type ProviderChunk } from "@/lib/providers/anthropic";
import { streamGemini } from "@/lib/providers/gemini";
import {
  isProviderUnavailable,
  markProviderUnavailable,
  classifyProviderError,
  clearProviderUnavailable,
} from "@/lib/provider-health";

export type ProviderName = "anthropic" | "gemini";

export interface PipelineResult {
  lp: LP;
  provider: ProviderName;
  raw: string;
  latencyMs: number;
}

export class PipelineError extends Error {
  constructor(
    public code:
      | "both_providers_failed"
      | "json_parse_fail"
      | "schema_validation_fail"
      | "aborted",
    message: string,
    public providerErrors?: Record<ProviderName, string>
  ) {
    super(message);
    this.name = "PipelineError";
  }
}

const PROVIDER_TIMEOUT_MS = 75_000;

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new SyntaxError("no JSON object found in raw output");
  }
  return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
}

async function runProvider(
  provider: ProviderName,
  companyInput: string,
  persona: Persona,
  onChunk: (chunk: ProviderChunk) => void,
  outerSignal: AbortSignal
): Promise<{ raw: string; latencyMs: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  outerSignal.addEventListener("abort", () => controller.abort());
  const start = Date.now();
  let raw = "";

  try {
    const source =
      provider === "anthropic"
        ? streamAnthropic({ companyInput, persona, signal: controller.signal })
        : streamGemini({ companyInput, persona, signal: controller.signal });

    for await (const chunk of source) {
      raw += chunk.text;
      onChunk(chunk);
    }
    return { raw, latencyMs: Date.now() - start };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runPipeline({
  companyInput,
  persona,
  signal,
  onChunk,
  onProvider,
}: {
  companyInput: string;
  persona: Persona;
  signal: AbortSignal;
  onChunk: (chunk: ProviderChunk) => void;
  onProvider?: (provider: ProviderName) => void;
}): Promise<PipelineResult> {
  const providerErrors: Record<string, string> = {};

  for (const provider of ["anthropic", "gemini"] as const) {
    if (signal.aborted) throw new PipelineError("aborted", "request aborted");
    if (provider === "anthropic" && !process.env.ANTHROPIC_API_KEY) {
      providerErrors.anthropic = "ANTHROPIC_API_KEY not set";
      continue;
    }
    if (provider === "gemini" && !process.env.GEMINI_API_KEY) {
      providerErrors.gemini = "GEMINI_API_KEY not set";
      continue;
    }

    const health = await isProviderUnavailable(provider);
    if (health.unavailable) {
      providerErrors[provider] = `skipped (cached: ${health.reason ?? "unavailable"})`;
      continue;
    }

    onProvider?.(provider);
    try {
      const { raw, latencyMs } = await runProvider(
        provider,
        companyInput,
        persona,
        onChunk,
        signal
      );

      let parsed: unknown;
      try {
        parsed = extractJson(raw);
      } catch (err) {
        providerErrors[provider] = `json_parse_fail: ${(err as Error).message}`;
        continue;
      }

      const meta = {
        provider,
        generatedAt: new Date().toISOString(),
      };
      const withMeta = { ...(parsed as object), meta };

      const validated = LPSchema.safeParse(withMeta);
      if (!validated.success) {
        providerErrors[provider] = `schema_validation_fail: ${validated.error.issues
          .slice(0, 3)
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")}`;
        continue;
      }

      await clearProviderUnavailable(provider);

      return {
        lp: validated.data,
        provider,
        raw,
        latencyMs,
      };
    } catch (err) {
      const e = err as Error;
      providerErrors[provider] = `${e.name}: ${e.message}`;

      const classification = classifyProviderError(provider, e);
      if (classification?.shouldCache) {
        await markProviderUnavailable(
          provider,
          classification.reason,
          classification.ttlSec
        );
      }

      if (e.name === "AbortError" && signal.aborted) {
        throw new PipelineError("aborted", "request aborted", providerErrors as Record<ProviderName, string>);
      }
    }
  }

  throw new PipelineError(
    "both_providers_failed",
    "Both providers failed. See providerErrors for details.",
    providerErrors as Record<ProviderName, string>
  );
}
