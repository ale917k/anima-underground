import type { Settings, VisitSection } from "@/lib/content/schema";
import { telHref } from "@/lib/content/schema";

/**
 * "Dove & quando" — hours + address. Hours/labels are owner-editable; the
 * address & phone come from the shared NAP settings (also feed footer + future
 * NightClub schema).
 */
export function Visit({
  data,
  settings,
}: {
  data: VisitSection;
  settings: Settings;
}) {
  const { nap } = settings;
  return (
    <section
      id="dove"
      className="relative scroll-mt-24 px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        {/* Hours */}
        <div className="rounded-glam border border-line bg-surface p-8 md:p-10">
          <span className="text-sm font-semibold tracking-[0.3em] text-neon-cyan uppercase">
            {data.hoursEyebrow}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink uppercase md:text-4xl">
            {data.hoursHeading}
          </h2>
          <ul className="mt-6 divide-y divide-line">
            {data.hours.map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between py-3.5"
              >
                <span className="font-medium text-ink">{h.label}</span>
                <span className="text-ink-dim">{h.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink-dim">{data.hoursNote}</p>
        </div>

        {/* Address */}
        <div className="flex flex-col justify-between rounded-glam border border-line bg-surface p-8 md:p-10">
          <div>
            <span className="text-sm font-semibold tracking-[0.3em] text-neon-magenta uppercase">
              {data.placeEyebrow}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink uppercase md:text-4xl">
              {data.placeHeading}
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
                href={telHref(nap.phone)}
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
            {data.mapsCtaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
