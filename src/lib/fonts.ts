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
  display: "swap",
});

/** Body / UI face — Inter. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
