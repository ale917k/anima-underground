import { AmbientBackground } from "@/components/site/AmbientBackground";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Nights } from "@/components/site/Nights";
import { Gallery } from "@/components/site/Gallery";
import { Ethos } from "@/components/site/Ethos";
import { Visit } from "@/components/site/Visit";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function Home() {
  return (
    <>
      <AmbientBackground />
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Nights />
        <Gallery />
        <Ethos />
        <Visit />
      </main>
      <SiteFooter />
    </>
  );
}
