import { SCHEMA_VERSION, type SiteContent } from "./schema";

/**
 * The seed document. Mirrors the original static site (lib/site.ts + data/
 * nights.ts) field-for-field, so the public site renders identically until the
 * owner publishes an edit. Also the fallback whenever S3 has no document yet
 * (fresh deploy, or local dev with no store).
 *
 * ⚠️ Confidence carried over from the research dossier: address & phone HIGH;
 * email, exact hours, TikTok handle UNCONFIRMED → owner edits in the dashboard.
 */
export const defaultContent: SiteContent = {
  schemaVersion: SCHEMA_VERSION,
  settings: {
    identity: {
      name: "Anima Underground",
      shortName: "Anima",
      since: "21 settembre 2019",
      city: "Padova",
      tagline: "Music · Dance · Drinks",
    },
    nap: {
      street: "Via della Croce Rossa 46",
      postalCode: "35129",
      locality: "Padova",
      province: "PD",
      region: "Veneto",
      country: "Italia",
      phone: "+39 338 744 3089",
      email: "info@animaunderground.it",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Anima+Underground+Via+della+Croce+Rossa+46+Padova",
    },
    socials: {
      instagram: "https://www.instagram.com/anima_underground/",
      instagramHandle: "@anima_underground",
      facebook: "https://www.facebook.com/AnimaPadova/",
      tiktok: "https://www.tiktok.com/@anima.underground",
    },
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      enabled: true,
      titleTop: "Anima",
      titleBottom: "Underground",
      subtitle:
        "Il cuore {queer} della notte padovana. Drag show, DJ set e le serate più famose della città.",
      taglineLine: "Music · Dance · Drinks",
      media: {
        poster: "/media/hero-poster.jpg",
        // mp4 (H.264) only by default — universal + hardware-decoded on mobile,
        // and smaller than VP9 here. webm is optional (used if set).
        webm: "",
        mp4: "/media/hero.mp4",
      },
      ctaPrimary: { label: "Scopri le serate", href: "/#serate" },
      ctaSecondary: { label: "Come arrivare", href: "/#dove" },
    },
    {
      id: "marquee",
      type: "marquee",
      enabled: true,
      items: [
        "TROJAJO 💦",
        "ANIMA TRASH 👑",
        "DAME MÁS 🔥",
        "DRAG SHOW",
        "BE YOURSELF 🌈",
        "MUSIC · DANCE · DRINKS",
        "INGRESSO LIBERO",
        "ANIMA IS CALLING 🎶",
      ],
    },
    {
      id: "nights",
      type: "nights",
      enabled: true,
      eyebrow: "Le serate",
      heading: "Ogni notte ha la sua anima",
      intro:
        "Dal venerdì ignorante alle regine del drag, fino al ritmo latino del sabato. Trova la tua.",
      items: [
        {
          id: "trojajo",
          name: "TROJAJO",
          emoji: "💦",
          day: "Venerdì",
          cadence: "Ogni venerdì",
          tagline: "Il venerdì ignorante dell'Anima",
          blurb:
            "Aperitivo dalle 18, poi si scende. Niente filtri, solo hit, glitter e gente come te. Vi era un po' mancato, eh?",
          accent: "trojajo",
        },
        {
          id: "anima-trash",
          name: "ANIMA TRASH",
          emoji: "👑",
          day: "Sabato",
          cadence: "Un sabato al mese",
          tagline: "Drag, trash & chic",
          blurb:
            "Il collettivo veneziano TRASH & CHIC sbarca a Padova: drag show, regine e una delle serate più attese della città. Ingresso libero.",
          accent: "trash",
        },
        {
          id: "dame-mas",
          name: "DAME MÁS",
          emoji: "🔥",
          day: "Sabato",
          cadence: "Serata latina",
          tagline: "Reggaeton & ritmo latino",
          blurb:
            "Perreo fino a tardi. Il sabato più caliente del Veneto, tra reggaeton, latino e tanta, tantissima energia.",
          accent: "damemas",
        },
        {
          id: "anima-is-calling",
          name: "ANIMA IS CALLING",
          emoji: "🎶",
          day: "Mercoledì",
          cadence: "Infrasettimanale",
          tagline: "Per chi le serate le fa",
          blurb:
            "La notte di metà settimana pensata per gli insider della scena. Quando l'Anima chiama, si risponde.",
          accent: "calling",
        },
      ],
    },
    {
      id: "gallery",
      type: "gallery",
      enabled: true,
      eyebrow: "Galleria",
      heading: "Le notti all'Anima",
      intro:
        "Luci, drag, musica e tanta gente come te. Un assaggio dell'atmosfera — il resto vienitelo a vivere.",
      images: [
        {
          id: "g1",
          src: "/media/gallery-1.jpg",
          alt: "La pista dell'Anima sotto i laser al neon",
        },
        { id: "g2", src: "/media/gallery-5.jpg", alt: "Sul dancefloor, mani in alto" },
        { id: "g3", src: "/media/gallery-2.jpg", alt: "Folla in pista durante la serata" },
        { id: "g4", src: "/media/gallery-3.jpg", alt: "DJ set tra gli schermi LED" },
        { id: "g5", src: "/media/gallery-6.jpg", alt: "Luci e atmosfera del club" },
        { id: "g6", src: "/media/gallery-4.jpg", alt: "Console e luci in movimento" },
      ],
      ctaLabel: "Vedi tutto su Instagram {handle} →",
    },
    {
      id: "ethos",
      type: "ethos",
      enabled: true,
      soul: "Noi ci abbiamo messo l'anima, voi metteteci il cuore.",
      body: "Uno spazio dove essere sé stessi, senza filtri e senza giudizio. Una famiglia, prima ancora di un locale.",
      badges: [
        "Ingresso libero — perché pagare per divertirsi?",
        "Proud to be · be yourself",
      ],
    },
    {
      id: "visit",
      type: "visit",
      enabled: true,
      hoursEyebrow: "Quando",
      hoursHeading: "Orari",
      hours: [
        { id: "h1", label: "Mercoledì", value: "Da confermare" },
        { id: "h2", label: "Venerdì", value: "18:00 – 04:00" },
        { id: "h3", label: "Sabato", value: "18:00 – 04:00" },
      ],
      hoursNote:
        "Gli orari possono variare in occasione di eventi speciali. Segui Instagram per la programmazione aggiornata.",
      placeEyebrow: "Dove",
      placeHeading: "Come arrivare",
      mapsCtaLabel: "Apri su Google Maps →",
    },
  ],
};
