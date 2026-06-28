"use client";

import { useEffect, useRef } from "react";
import type { HeroMedia } from "@/lib/content/schema";

/**
 * Looping video background for the hero.
 * - The `poster` paints immediately (it's the LCP element); the video streams
 *   in over it, so heavy media never blocks first paint.
 * - Muted + playsInline + programmatic play() = reliable mobile autoplay.
 * - Respects prefers-reduced-motion: we simply don't start playback, leaving
 *   the poster still. No-JS also falls back to the poster.
 */
export function HeroVideo({ media }: { media: HeroMedia }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {
      /* autoplay blocked — poster stays, which is fine */
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={media.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={media.webm} type="video/webm" />
        <source src={media.mp4} type="video/mp4" />
      </video>

      {/* Legibility scrim — darker at top/bottom, fades to solid void so the
          hero blends seamlessly into the next section. */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/75 via-void/55 to-void" />
      {/* Neon tint to marry the footage to our palette */}
      <div className="absolute inset-0 bg-neon-magenta/10 mix-blend-overlay" />
    </div>
  );
}
