"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeroMedia } from "@/lib/content/schema";
import { clsx } from "@/lib/clsx";

/**
 * Hero background — fast first paint, video on every device (incl. mobile).
 * - The LCP is an OPTIMIZED responsive poster (next/image → WebP at the device
 *   resolution) → instant first paint, even on a phone.
 * - The looping video is DEFERRED: it only starts loading after the page's
 *   initial `load`, then fades in over the poster, so it never competes with the
 *   critical render. It still plays on mobile (muted + playsInline). Skipped only
 *   for prefers-reduced-motion and explicit Save-Data (honouring user intent).
 * - No-JS / SSR renders the poster only (the video element is client-gated).
 */
export function HeroVideo({ media }: { media: HeroMedia }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (conn?.saveData) return;

    // Defer until after the page has loaded, so the video never blocks first
    // paint or competes with critical resources. Then mount it a tick later.
    let timer: number;
    const start = () => {
      timer = window.setTimeout(() => setLoad(true), 200);
    };
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, []);

  useEffect(() => {
    if (load) videoRef.current?.play().catch(() => {});
  }, [load]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Optimized, responsive poster — the LCP element. */}
      <Image
        src={media.poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {load && (
        <video
          ref={videoRef}
          className={clsx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        >
          {media.webm && <source src={media.webm} type="video/webm" />}
          <source src={media.mp4} type="video/mp4" />
        </video>
      )}

      {/* Legibility scrim — darker at top/bottom, fades to solid void so the
          hero blends seamlessly into the next section. */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/75 via-void/55 to-void" />
      {/* Neon tint to marry the footage to our palette */}
      <div className="absolute inset-0 bg-neon-magenta/10 mix-blend-overlay" />
    </div>
  );
}
