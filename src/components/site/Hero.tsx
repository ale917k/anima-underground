import Link from "next/link";
import { site } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

/**
 * Above-the-fold hero. Entrance is pure-CSS (`.enter` keyframe) so it renders
 * instantly server-side, animates without hydration, and is good for LCP.
 * A looping video sits behind the content (poster-first, see HeroVideo).
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-20 text-center">
      <HeroVideo />
      <div className="relative z-10 flex flex-col items-center">
        {/* eyebrow */}
        <p className="enter enter-1 mb-6 inline-flex items-center gap-2 rounded-pill border border-line px-4 py-1.5 text-xs font-medium tracking-wide text-ink-dim uppercase">
          <span className="h-2 w-2 rounded-full bg-neon-cyan shadow-glow-c" />
          {site.city} · dal {site.since}
        </p>

        {/* wordmark */}
        <h1 className="font-display leading-[0.85] uppercase">
          <span className="enter enter-2 text-neon block text-[clamp(3.5rem,16vw,11rem)] font-bold tracking-tight">
            Anima
          </span>
          <span className="enter enter-3 block text-[clamp(1.5rem,6.5vw,4.5rem)] font-medium tracking-[0.22em] text-ink-dim">
            Underground
          </span>
        </h1>

        {/* tagline */}
        <p className="enter enter-4 mt-8 max-w-xl text-lg text-balance text-ink-dim md:text-xl">
          Il cuore <span className="text-pride font-semibold">queer</span> della
          notte padovana. Drag show, DJ set e le serate più famose della città.
        </p>
        <p className="enter enter-4 mt-2 font-display text-sm font-medium tracking-[0.3em] text-ink uppercase">
          Music · Dance · Drinks
        </p>

        {/* CTAs */}
        <div className="enter enter-5 mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/#serate"
            className="rounded-pill bg-neon-magenta px-7 py-3.5 text-base font-semibold text-white shadow-neon transition-transform hover:scale-[1.03]"
          >
            Scopri le serate
          </Link>
          <Link
            href="/#dove"
            className="rounded-pill border border-line px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:border-ink"
          >
            Come arrivare
          </Link>
        </div>
      </div>

      {/* scroll hint */}
      <div className="enter enter-5 absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs tracking-widest text-ink-dim uppercase">
        scroll ↓
      </div>
    </section>
  );
}
