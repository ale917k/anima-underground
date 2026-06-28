/** Tiny className joiner (no dependency). Falsy values are dropped. */
export function clsx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
