import { site } from "@/lib/site";

/**
 * "Dove & quando" — hours + address. Reads the NAP single source (lib/site).
 * In Phase 1 this same data comes from the DB and feeds NightClub schema too.
 */
export function Visit() {
  const { nap, hours } = site;
  return (
    <section
      id="dove"
      className="relative scroll-mt-24 px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        {/* Hours */}
        <div className="rounded-glam border border-line bg-surface p-8 md:p-10">
          <span className="text-sm font-semibold tracking-[0.3em] text-neon-cyan uppercase">
            Quando
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink uppercase md:text-4xl">
            Orari
          </h2>
          <ul className="mt-6 divide-y divide-line">
            {hours.map((h) => (
              <li
                key={h.day}
                className="flex items-center justify-between py-3.5"
              >
                <span className="font-medium text-ink">{h.label}</span>
                <span className="text-ink-dim">
                  {"open" in h && h.open
                    ? `${h.open} – ${h.close}`
                    : "Da confermare"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink-dim">
            Gli orari possono variare in occasione di eventi speciali. Segui
            Instagram per la programmazione aggiornata.
          </p>
        </div>

        {/* Address */}
        <div className="flex flex-col justify-between rounded-glam border border-line bg-surface p-8 md:p-10">
          <div>
            <span className="text-sm font-semibold tracking-[0.3em] text-neon-magenta uppercase">
              Dove
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink uppercase md:text-4xl">
              Come arrivare
            </h2>
            <address className="mt-6 text-lg leading-relaxed text-ink not-italic">
              {nap.street}
              <br />
              {nap.postalCode} {nap.locality} ({nap.province})
              <br />
              {nap.region}, {nap.country}
            </address>
            <p className="mt-4 text-ink-dim">
              <a
                href={nap.phoneHref}
                className="font-medium text-ink transition-colors hover:text-neon-magenta"
              >
                {nap.phone}
              </a>
            </p>
          </div>

          <a
            href={nap.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-pill bg-neon-magenta px-6 py-3 font-semibold text-white shadow-neon transition-transform hover:scale-[1.03]"
          >
            Apri su Google Maps →
          </a>
        </div>
      </div>
    </section>
  );
}
