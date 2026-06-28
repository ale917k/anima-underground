import { clsx } from "@/lib/clsx";

/**
 * The ANIMA UNDERGROUND wordmark, set in ClashDisplay to echo the venue's
 * angular sci-fi logo: bold "ANIMA" over wide-tracked "UNDERGROUND".
 */
export function Wordmark({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={clsx(
        "font-display leading-none uppercase",
        size === "sm" ? "text-base" : "text-2xl",
        className,
      )}
    >
      <span className="font-bold tracking-tight">Anima</span>{" "}
      <span className="font-medium tracking-[0.25em] text-ink-dim">
        Underground
      </span>
    </span>
  );
}
