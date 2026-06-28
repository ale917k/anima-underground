import type { SiteContent } from "@/lib/content/schema";
import { AmbientBackground } from "./AmbientBackground";
import { SiteHeader } from "./SiteHeader";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Nights } from "./Nights";
import { Gallery } from "./Gallery";
import { Ethos } from "./Ethos";
import { Visit } from "./Visit";
import { SiteFooter } from "./SiteFooter";

/**
 * Renders the full marketing page from a content document. Deliberately a
 * shared (isomorphic) component — the public route renders it server-side (for
 * SSR/SEO/no-JS resilience), and the dashboard renders the very same component
 * with the working draft, so the editor preview is a true 1:1 replica.
 *
 * Only enabled sections render, in their stored order.
 */
export function SiteShell({ content }: { content: SiteContent }) {
  const { settings, sections } = content;

  return (
    <>
      <AmbientBackground />
      <SiteHeader settings={settings} />
      <main>
        {sections
          .filter((section) => section.enabled)
          .map((section) => {
            switch (section.type) {
              case "hero":
                return (
                  <Hero key={section.id} data={section} settings={settings} />
                );
              case "marquee":
                return <Marquee key={section.id} data={section} />;
              case "nights":
                return <Nights key={section.id} data={section} />;
              case "gallery":
                return (
                  <Gallery
                    key={section.id}
                    data={section}
                    settings={settings}
                  />
                );
              case "ethos":
                return <Ethos key={section.id} data={section} />;
              case "visit":
                return (
                  <Visit key={section.id} data={section} settings={settings} />
                );
              default:
                return null;
            }
          })}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
