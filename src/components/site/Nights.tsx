import type { CSSProperties } from "react";
import { nights, type Night } from "@/data/nights";
import { Reveal } from "./Reveal";

function NightCard({ night, index }: { night: Night; index: number }) {
  // expose the per-night accent as --accent for use in this card's styles
  const style = { "--accent": `var(${night.accentVar})` } as CSSProperties;

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

export function Nights() {
  return (
    <section
      id="serate"
      className="relative scroll-mt-24 px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col gap-3">
          <span className="text-sm font-semibold tracking-[0.3em] text-neon-magenta uppercase">
            Le serate
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink uppercase md:text-6xl">
            Ogni notte ha la sua anima
          </h2>
          <p className="max-w-2xl text-lg text-ink-dim">
            Dal venerdì ignorante alle regine del drag, fino al ritmo latino del
            sabato. Trova la tua.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {nights.map((night, i) => (
            <NightCard key={night.slug} night={night} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
