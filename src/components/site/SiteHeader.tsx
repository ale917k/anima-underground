"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { clsx } from "@/lib/clsx";
import { Wordmark } from "./Wordmark";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass py-3" : "py-5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label={site.name} className="shrink-0">
          <Wordmark size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-ink-dim transition-colors hover:text-ink"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-neon-magenta shadow-neon transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-pill border border-line px-4 py-2 text-sm font-semibold text-ink transition-all hover:border-neon-magenta hover:shadow-neon sm:inline-block"
          >
            Stasera all&apos;Anima →
          </Link>

          <button
            type="button"
            aria-label="Apri menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-line text-ink md:hidden"
          >
            <span className="sr-only">Menu</span>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="glass mx-5 mt-3 flex flex-col gap-1 rounded-glam p-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-ink-dim hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-pill bg-neon-magenta px-3 py-2 text-center text-base font-semibold text-white"
          >
            Seguici su Instagram →
          </Link>
        </nav>
      )}
    </header>
  );
}
