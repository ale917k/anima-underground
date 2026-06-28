import "server-only";

import { cookies } from "next/headers";
import {
  createToken,
  verifyToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionPayload,
} from "./token";

/** Cookie-backed session helpers. `cookies()` is async in Next 16. */

export async function createSession(sub: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(sub), {
    httpOnly: true,
    // Secure in production (HTTPS via CloudFront); relaxed on http://localhost
    // so the dashboard works in local dev.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
