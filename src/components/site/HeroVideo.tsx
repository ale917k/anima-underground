"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeroMedia } from "@/lib/content/schema";
import { clsx } from "@/lib/clsx";

/**
 * Hero background. Performance-first:
 * - The LCP is an OPTIMIZED, responsive poster (next/image → WebP/AVIF at the
 *   device's resolution), so first paint is tiny and fast — especially on mobile.
 * - The heavy looping video (~MBs) is NEVER fetched on phones, slow/metered
 *   connections, data-saver, or reduced-motion. Where it IS shown (capable
 *   viewports), it's deferred until the browser is idle so it can't compete with
 *   the critical render, then it fades in over the poster.
 * - No-JS / SSR renders the poster only (the video element is client-gated).
 *
 * Net effect: mobile first load drops from ~MBs to a ~20 KB poster.
 */
export function HeroVideo({ media }: { media: HeroMedia }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Don't stream the heavy video when it would hurt more than help.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phones get the crisp poster only — keeps mobile fast and data-light.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g|3g/.test(conn.effectiveType)) return;

    // Defer the fetch+play past first paint so it never blocks the critical render.
    const id = window.setTimeout(() => setShowVideo(true), 1200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (showVideo) videoRef.current?.play().catch(() => {});
  }, [showVideo]);

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

      {showVideo && (
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
          <source src={media.webm} type="video/webm" />
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
