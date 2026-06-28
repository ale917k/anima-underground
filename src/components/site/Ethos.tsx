import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

/** Ethos band — the venue's soul, in their own words. Pride-forward. */
export function Ethos() {
  return (
    <section id="anima" className="relative scroll-mt-24 px-5 py-20 md:py-28">
      <Reveal className="glass mx-auto flex max-w-[1100px] flex-col items-center gap-6 rounded-glam px-6 py-14 text-center md:px-16">
        <span className="text-2xl">🌈</span>
        <p className="font-display text-3xl font-semibold tracking-tight text-balance text-ink uppercase md:text-5xl">
          {site.ethos.soul}
        </p>
        <p className="max-w-xl text-lg text-ink-dim">
          Uno spazio dove essere sé stessi, senza filtri e senza giudizio. Una
          famiglia, prima ancora di un locale.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-pill border border-line px-4 py-2 text-sm font-medium text-ink">
            {site.ethos.free}
          </span>
          <span className="rounded-pill border border-line px-4 py-2 text-sm font-medium text-ink">
            {site.ethos.proud}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
