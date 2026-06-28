import Image from "next/image";
import type { GallerySection, Settings } from "@/lib/content/schema";
import { Reveal } from "./Reveal";
import { clsx } from "@/lib/clsx";

/**
 * Image-led gallery. A mixed-size grid (first tile spans 2x2) of next/image
 * shots with a hover zoom + neon ring. Images + copy are owner-editable; the
 * CTA's {handle} token is filled from settings.socials.
 */
export function Gallery({
  data,
  settings,
}: {
  data: GallerySection;
  settings: Settings;
}) {
  const cta = data.ctaLabel.replace(
    "{handle}",
    settings.socials.instagramHandle,
  );

  return (
    <section
      id="galleria"
      className="relative scroll-mt-24 px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col gap-3">
          <span className="text-sm font-semibold tracking-[0.3em] text-neon-cyan uppercase">
            {data.eyebrow}
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink uppercase md:text-6xl">
            {data.heading}
          </h2>
          <p className="max-w-2xl text-lg text-ink-dim">{data.intro}</p>
        </Reveal>

        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
          {data.images.map((img, i) => (
            <Reveal
              key={img.id}
              delay={i * 60}
              className={clsx(
                "group relative overflow-hidden rounded-glam border border-line",
                i === 0 && "col-span-2 row-span-2",
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={
                  i === 0
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 768px) 50vw, 25vw"
                }
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* dark wash + neon ring on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-glam ring-0 ring-neon-magenta/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-neon-magenta/60" />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center">
          <a
            href={settings.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-pill border border-line px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-neon-magenta hover:shadow-neon"
          >
            {cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
