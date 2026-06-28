import crypto from "node:crypto";

/**
 * Stateless session token: `base64url(payload).hmacSHA256(payload)`.
 * Pure Node crypto — no external dependency, and no `next/headers` import, so it
 * can be used anywhere on the server (cookie helpers, server actions).
 *
 * This is a signed (tamper-proof) token, not encrypted: the payload is readable
 * but cannot be forged without SESSION_SECRET. We only store a username + expiry
 * — nothing sensitive.
 */

const SECRET =
  process.env.SESSION_SECRET ?? "dev-insecure-session-secret-change-me";
export const SESSION_COOKIE = "anima_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

export type SessionPayload = { sub: string; exp: number };

function sign(body: string): string {
  return crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
}

export function createToken(sub: string): string {
  const payload: SessionPayload = {
    sub,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyToken(token?: string): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString(),
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
