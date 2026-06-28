import type { Metadata } from "next";
import { clashDisplay, inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anima Underground · Il cuore queer della notte a Padova",
    template: "%s · Anima Underground",
  },
  description:
    "Anima Underground è il locale LGBTQ+ di Padova: drag show, DJ set e le serate più famose della città — TROJAJO, Anima Trash, Dame Más. Music, Dance & Drinks. Ingresso libero, be yourself. 🌈",
  keywords: [
    "locale gay Padova",
    "locale LGBT Padova",
    "drag show Padova",
    "discoteca gay Padova",
    "serate gay Padova",
    "Anima Underground",
    "gay club Padua",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: site.name,
    title: "Anima Underground · Il cuore queer della notte a Padova",
    description:
      "Drag show, DJ set e le serate più famose di Padova. Music, Dance & Drinks. Be yourself. 🌈",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Anima Underground · Padova",
    description: "Il locale LGBTQ+ di Padova. Music, Dance & Drinks. 🌈",
  },
  robots: {
    // ⚠️ keep noindex until we promote to the real domain (preview-first plan)
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${clashDisplay.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full">
        {/* No-JS safety net: never leave scroll-reveal content trapped hidden. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
