import type { CSSProperties } from "react";
import type { NightItem, NightsSection } from "@/lib/content/schema";
import { Reveal } from "./Reveal";

function NightCard({ night, index }: { night: NightItem; index: number }) {
  // expose the per-night accent as --accent for use in this card's styles
  const style = {
    "--accent": `var(--color-night-${night.accent})`,
  } as CSSProperties;

  return (
    <Reveal delay={index * 70} className="h-full">
      <article
        style={style}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-glam border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--accent)"
      >
        {/* accent glow wash on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: "var(--accent)" }}
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-3xl">{night.emoji}</span>
            <span className="rounded-pill border border-line px-3 py-1 text-xs font-medium tracking-wide text-ink-dim uppercase">
              {night.day}
            </span>
          </div>

          <h3 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink uppercase transition-colors group-hover:text-(--accent)">
            {night.name}
          </h3>
          <p
            className="mt-1 text-sm font-semibold"
            style={{ color: "var(--accent)" }}
          >
            {night.tagline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">
            {night.blurb}
          </p>
        </div>

        <p className="relative mt-6 text-xs font-medium tracking-wide text-ink-dim/80 uppercase">
          {night.cadence}
        </p>
      </article>
    </Reveal>
  );
}

export function Nights({ data }: { data: NightsSection }) {
  return (
    <section
      id="serate"
      className="relative scroll-mt-24 px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col gap-3">
          <span className="text-sm font-semibold tracking-[0.3em] text-neon-magenta uppercase">
            {data.eyebrow}
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink uppercase md:text-6xl">
            {data.heading}
          </h2>
          <p className="max-w-2xl text-lg text-ink-dim">{data.intro}</p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((night, i) => (
            <NightCard key={night.id} night={night} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
