import localFont from "next/font/local";
import { Inter } from "next/font/google";

/**
 * Display face — ClashDisplay (self-hosted, variable).
 * Angular, geometric; echoes the venue's chevron-A sci-fi logo wordmark.
 * Licensed for commercial use (see src/fonts/ClashDisplay-LICENSE.txt).
 */
export const clashDisplay = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  // `optional`: the hero wordmark (the LCP) renders immediately in the metric-
  // matched fallback and only upgrades to ClashDisplay if it's already cached/
  // fast — so the largest paint never waits on (or repaints from) the font swap.
  // `adjustFontFallback` defaults to a metric-matched fallback (no CLS).
  display: "optional",
  preload: true,
});

/** Body / UI face — Inter. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
