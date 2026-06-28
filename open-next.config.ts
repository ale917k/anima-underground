// OpenNext configuration — packages the Next.js build for AWS (Lambda + S3 + CloudFront).
// Minimal config: a single default server function + the image-optimization function.
// The CDK in /infra wires the generated .open-next output (see open-next.output.json).
const config = {
  // Single default server function + image-optimization function, all on the
  // OpenNext default (x64) so the CDK can use one architecture everywhere and
  // avoid bundle/runtime mismatches. (arm64 is a pennies-level optimization we
  // can revisit later once the deploy is proven.)
  default: {},
};

export default config;
