#!/usr/bin/env node
/**
 * Generate a scrypt password hash for the dashboard login.
 *
 *   node scripts/hash-password.mjs 'your-strong-password'
 *
 * Copy the printed value into DASHBOARD_PASSWORD_HASH (env var on the server
 * Lambda — set it in infra/lib/site-stack.ts or via CDK context, never commit
 * the plaintext).
 */
import crypto from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs '<password>'");
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");
const key = crypto.scryptSync(password, salt, 32).toString("hex");
console.log(`${salt}:${key}`);
