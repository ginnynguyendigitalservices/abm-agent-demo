import { Redis } from "@upstash/redis";

export type ProviderName = "anthropic" | "gemini";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const HEALTH_KEY = (p: ProviderName) => `abm-agent-demo:unavail:${p}`;

const CREDIT_EXHAUSTED_TTL_SEC = 60 * 60; // 1h
const QUOTA_EXHAUSTED_TTL_SEC = 10 * 60; // 10 min (quotas refill faster)

export type HealthStatus = {
  unavailable: boolean;
  reason?: string;
};

export async function isProviderUnavailable(
  provider: ProviderName
): Promise<HealthStatus> {
  if (!redis) return { unavailable: false };
  try {
    const val = await redis.get<string>(HEALTH_KEY(provider));
    if (val) return { unavailable: true, reason: val };
    return { unavailable: false };
  } catch {
    return { unavailable: false };
  }
}

export async function markProviderUnavailable(
  provider: ProviderName,
  reason: string,
  ttlSec: number
): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(HEALTH_KEY(provider), reason, { ex: ttlSec });
  } catch {
    // swallow; provider-health is best-effort
  }
}

export async function clearProviderUnavailable(
  provider: ProviderName
): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(HEALTH_KEY(provider));
  } catch {
    // swallow
  }
}

export function classifyProviderError(
  provider: ProviderName,
  err: unknown
): { shouldCache: boolean; reason: string; ttlSec: number } | null {
  const raw = err instanceof Error ? err.message : String(err);
  const msg = raw.toLowerCase();

  if (provider === "anthropic") {
    if (
      msg.includes("credit balance is too low") ||
      msg.includes("insufficient credit") ||
      msg.includes("insufficient_credits") ||
      msg.includes("billing")
    ) {
      return {
        shouldCache: true,
        reason: "credit_exhausted",
        ttlSec: CREDIT_EXHAUSTED_TTL_SEC,
      };
    }
  }

  if (provider === "gemini") {
    if (
      msg.includes("quota exceeded") ||
      msg.includes("resource_exhausted") ||
      msg.includes("exceeded your current quota")
    ) {
      return {
        shouldCache: true,
        reason: "quota_exhausted",
        ttlSec: QUOTA_EXHAUSTED_TTL_SEC,
      };
    }
  }

  return null;
}
