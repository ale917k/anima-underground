import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up a stray lockfile in $HOME.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
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
