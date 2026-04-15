import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const ratelimiter =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        analytics: true,
        prefix: "abm-agent-demo:rl",
      })
    : null;

export function isBypassedIp(ip: string): boolean {
  const raw = process.env.UPSTASH_BYPASS_IPS;
  if (!raw) return false;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(ip);
}

export function getIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function checkRateLimit(ip: string): Promise<
  | { ok: true; remaining: number; resetAt: number }
  | { ok: false; retryAfterSec: number; remaining: number; resetAt: number }
> {
  if (isBypassedIp(ip)) {
    return { ok: true, remaining: 999, resetAt: Date.now() + 3_600_000 };
  }

  if (!ratelimiter) {
    return { ok: true, remaining: 999, resetAt: Date.now() + 3_600_000 };
  }

  const result = await ratelimiter.limit(ip);
  const retryAfterSec = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));

  if (!result.success) {
    return {
      ok: false,
      retryAfterSec,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  return {
    ok: true,
    remaining: result.remaining,
    resetAt: result.reset,
  };
}
