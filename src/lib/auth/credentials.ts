import "server-only";

import crypto from "node:crypto";

/**
 * Single-user credential check (the owner + one trusted editor share one login,
 * no roles — per the brief). Configured via environment:
 *
 *   DASHBOARD_USER           — the username (default "anima")
 *   DASHBOARD_PASSWORD_HASH  — scrypt hash as "saltHex:keyHex"
 *
 * Generate a hash with: `node scripts/hash-password.mjs '<password>'`
 *
 * If no hash is set we fall back to a dev-only password so the dashboard works
 * locally out of the box. In production ALWAYS set DASHBOARD_PASSWORD_HASH.
 */

const USER = process.env.DASHBOARD_USER ?? "anima";
const HASH = process.env.DASHBOARD_PASSWORD_HASH ?? "";
const DEV_PASSWORD = "anima"; // only used when no hash configured

export const DASHBOARD_USER = USER;
export const usingDevPassword = HASH === "";

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function verifyCredentials(user: string, password: string): boolean {
  if (user !== USER) return false;

  if (!HASH) return password === DEV_PASSWORD;

  const [salt, key] = HASH.split(":");
  if (!salt || !key) return false;
  try {
    const derived = crypto.scryptSync(password, salt, 32).toString("hex");
    return constantTimeEqual(derived, key);
  } catch {
    return false;
  }
}
