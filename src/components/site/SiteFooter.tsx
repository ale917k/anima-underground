import Link from "next/link";
import type { Settings } from "@/lib/content/schema";
import { telHref } from "@/lib/content/schema";
import { NAV } from "@/lib/nav";
import { Wordmark } from "./Wordmark";

export function SiteFooter({ settings }: { settings: Settings }) {
  const { identity, nap, socials } = settings;
  const year = 2026; // static (no build-time Date) — bump as needed

  return (
    <footer className="relative border-t border-line px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* brand */}
          <div>
            <Wordmark size="lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-dim">
              Il locale LGBTQ+ di Padova dal {identity.since}. Music, Dance &amp;
              Drinks.{" "}
              <span className="text-pride font-semibold">Be yourself.</span>
            </p>
          </div>

          {/* nav */}
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-ink-dim uppercase">
              Naviga
            </span>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-ink-dim transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* contact + socials */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-ink-dim uppercase">
              Contatti
            </span>
            <address className="text-sm leading-relaxed text-ink-dim not-italic">
              {nap.street}
              <br />
              {nap.postalCode} {nap.locality} ({nap.province})
            </address>
            <a
              href={telHref(nap.phone)}
              className="text-sm text-ink-dim transition-colors hover:text-ink"
            >
              {nap.phone}
            </a>
            <div className="mt-2 flex gap-4">
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink-dim transition-colors hover:text-neon-magenta"
              >
                Instagram
              </a>
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink-dim transition-colors hover:text-neon-magenta"
              >
                Facebook
              </a>
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink-dim transition-colors hover:text-neon-magenta"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-dim sm:flex-row">
          <p>
            © {year} {identity.name} · {nap.locality}
          </p>
          <p className="text-pride font-semibold">
            Proud to be · be yourself 🌈
          </p>
        </div>
      </div>
    </footer>
  );
}
