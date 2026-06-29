// OpenNext configuration — packages the Next.js build for AWS (Lambda + S3 + CloudFront).
// Minimal config: a single default server function + the image-optimization function.
// The CDK in /infra wires the generated .open-next output (see open-next.output.json).
const config = {
  // Single default server function + image-optimization function, all on the
  // OpenNext default (x64) so the CDK can use one architecture everywhere and
  // avoid bundle/runtime mismatches. (arm64 is a pennies-level optimization we
  // can revisit later once the deploy is proven.)
  default: {},

  imageOptimization: {
    // Cross-install sharp for the LAMBDA runtime (linux x64), not the build host.
    // Two bugs in OpenNext's default otherwise leave the optimizer a no-op
    // (it bundles the build host's sharp binary; sharp then fails to load in the
    // Lambda, so next/image returns un-resized, un-converted originals):
    //   1. OpenNext defaults sharp to arch "arm64", but our ImageFn is X86_64.
    //   2. OpenNext passes `--os=linux`, but sharp 0.32's prebuild reads
    //      `npm_config_platform` (set by `--platform`), so on Apple Silicon it
    //      silently grabs the macOS (darwin-arm64) binary instead.
    // Forcing `--platform=linux` + arch x64 makes WebP/AVIF + responsive
    // resizing actually work. Verify post-build: the bundle must contain
    // node_modules/sharp/build/Release/sharp-linux-x64.node (NOT darwin).
    install: {
      packages: ["sharp@0.32.6"],
      arch: "x64",
      os: "linux",
      libc: "glibc",
      nodeVersion: "18",
      additionalArgs: "--platform=linux",
    },
  },
};

export default config;
