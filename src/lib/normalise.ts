const MAX_LENGTH = 200;
const ALLOWED = /^[\x20-\x7E\u00A0-\uFFFF]+$/;

export type NormaliseResult =
  | { ok: true; value: string; kind: "domain" | "name" }
  | { ok: false; code: "empty" | "too_long" | "invalid_chars" | "malformed_url" };

export function normaliseCompanyInput(raw: string): NormaliseResult {
  if (raw == null) return { ok: false, code: "empty" };
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, code: "empty" };
  if (trimmed.length > MAX_LENGTH) return { ok: false, code: "too_long" };
  if (!ALLOWED.test(trimmed)) return { ok: false, code: "invalid_chars" };

  const protocolMatch = trimmed.match(/^https?:\/\/(.+)$/i);
  const withoutProtocol = protocolMatch ? protocolMatch[1] : trimmed;

  if (/[\s@]/.test(withoutProtocol) && !protocolMatch) {
    const looksLikeBareName = /^[a-zA-Z0-9 &'.\-,]+$/.test(trimmed);
    if (looksLikeBareName) return { ok: true, value: trimmed, kind: "name" };
    return { ok: false, code: "malformed_url" };
  }

  const hostOnly = withoutProtocol.split("/")[0].replace(/^www\./i, "").toLowerCase();
  if (hostOnly.includes(".") && /^[a-z0-9.\-]+$/i.test(hostOnly)) {
    return { ok: true, value: hostOnly, kind: "domain" };
  }

  if (/^[a-zA-Z0-9 &'.\-,]+$/.test(trimmed)) {
    return { ok: true, value: trimmed, kind: "name" };
  }

  return { ok: false, code: "malformed_url" };
}
