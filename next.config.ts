import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Behind CloudFront → Lambda Function URL, the server sees Host = the Lambda URL
// but the browser sends Origin = the CloudFront (or custom) domain. Next's
// Server Actions CSRF check rejects that mismatch unless the public origin is
// allow-listed here. Derived from the build-time site URL, with the current
// CloudFront domain as a safety net (and an env escape hatch for new domains).
const allowedActionOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL &&
    new URL(process.env.NEXT_PUBLIC_SITE_URL).host,
  process.env.SERVER_ACTIONS_ALLOWED_ORIGIN,
  "djy410jozyctu.cloudfront.net",
].filter((v): v is string => Boolean(v));

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up a stray lockfile in $HOME.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },

  experimental: {
    serverActions: {
      allowedOrigins: allowedActionOrigins,
    },
  },

  // Old WordPress paths → new IA. (Real /eventi, /galleria pages arrive in a
  // later phase; only map the dead WP URLs here so we don't shadow them.)
  async redirects() {
    return [
      { source: "/events", destination: "/#serate", permanent: true },
      { source: "/come-raggiungerci", destination: "/#dove", permanent: true },
    ];
  },
};

export default nextConfig;
