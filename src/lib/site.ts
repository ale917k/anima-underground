/**
 * Static site constants — venue identity, NAP, socials, nav.
 *
 * ⚠️ TEMPORARY SINGLE SOURCE OF TRUTH.
 * In Phase 1 (DB foundation) this moves into the `site_settings` table so the
 * owner edits it from the dashboard. Until then, everything that needs NAP
 * imports from HERE — never hardcode address/phone in components.
 *
 * Confidence per research dossier (docs/research/anima-underground-profile.md):
 *  - address & phone: HIGH (multi-source incl. official police bulletin)
 *  - email, exact hours, TikTok URL: UNCONFIRMED → confirm with owner.
 */

export const site = {
  name: "Anima Underground",
  shortName: "Anima",
  // The venue's own short self-description (IG bio voice)
  tagline: "Music · Dance · Drinks",
  since: "21 settembre 2019",
  city: "Padova",

  nap: {
    street: "Via della Croce Rossa 46",
    postalCode: "35129",
    locality: "Padova",
    province: "PD",
    region: "Veneto",
    country: "Italia",
    // HIGH confidence
    phone: "+39 338 744 3089",
    phoneHref: "tel:+393387443089",
    // ⚠️ UNCONFIRMED — placeholder until owner confirms the monitored inbox
    email: "info@animaunderground.it",
    geo: { lat: 45.4064, lng: 11.8768 }, // ⚠️ approximate — confirm exact pin
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Anima+Underground+Via+della+Croce+Rossa+46+Padova",
  },

  socials: {
    instagram: "https://www.instagram.com/anima_underground/",
    instagramHandle: "@anima_underground",
    facebook: "https://www.facebook.com/AnimaPadova/",
    // ⚠️ old site link was broken — confirm correct handle with owner
    tiktok: "https://www.tiktok.com/@anima.underground",
  },

  // Most reliable hours = the IG bio. Wed is a confirmed operating night but
  // hours vary across sources → confirm with owner before treating as canonical.
  hours: [
    { day: "Mer", label: "Mercoledì", note: "Anima is calling", tbd: true },
    { day: "Ven", label: "Venerdì", open: "18:00", close: "04:00" },
    { day: "Sab", label: "Sabato", open: "18:00", close: "04:00" },
  ],

  ethos: {
    free: "Ingresso libero — perché pagare per divertirsi?",
    soul: "Noi ci abbiamo messo l'anima, voi metteteci il cuore.",
    proud: "Proud to be · be yourself",
  },
} as const;

/**
 * Media assets.
 * ⚠️ PLACEHOLDERS — royalty-free nightclub footage/stills (Mixkit license, free
 * for commercial use) used to show the treatment. Swap with Anima's own footage
 * & photos (drop-in replace these files, or wire to the gallery DB in Phase 3).
 */
export const media = {
  hero: {
    poster: "/media/hero-poster.jpg",
    webm: "/media/hero.webm",
    mp4: "/media/hero.mp4",
  },
  gallery: [
    {
      src: "/media/gallery-1.jpg",
      alt: "La pista dell'Anima sotto i laser al neon",
    },
    { src: "/media/gallery-5.jpg", alt: "Sul dancefloor, mani in alto" },
    { src: "/media/gallery-2.jpg", alt: "Folla in pista durante la serata" },
    { src: "/media/gallery-3.jpg", alt: "DJ set tra gli schermi LED" },
    { src: "/media/gallery-6.jpg", alt: "Luci e atmosfera del club" },
    { src: "/media/gallery-4.jpg", alt: "Console e luci in movimento" },
  ],
} as const;

// Phase 0 landing only links to sections that exist. Eventi / Chi siamo become
// real routes in later phases and get added back here then.
export const nav = [
  { label: "Le serate", href: "/#serate" },
  { label: "Galleria", href: "/#galleria" },
  { label: "La nostra anima", href: "/#anima" },
  { label: "Dove siamo", href: "/#dove" },
] as const;
