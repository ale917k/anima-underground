import type { EthosSection } from "@/lib/content/schema";
import { Reveal } from "./Reveal";

/** Ethos band — the venue's soul, in their own words. Pride-forward. */
export function Ethos({ data }: { data: EthosSection }) {
  return (
    <section id="anima" className="relative scroll-mt-24 px-5 py-20 md:py-28">
      <Reveal className="glass mx-auto flex max-w-[1100px] flex-col items-center gap-6 rounded-glam px-6 py-14 text-center md:px-16">
        <span className="text-2xl">🌈</span>
        <p className="font-display text-3xl font-semibold tracking-tight text-balance text-ink uppercase md:text-5xl">
          {data.soul}
        </p>
        <p className="max-w-xl text-lg text-ink-dim">{data.body}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {data.badges.map((badge, i) => (
            <span
              key={i}
              className="rounded-pill border border-line px-4 py-2 text-sm font-medium text-ink"
            >
              {badge}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
