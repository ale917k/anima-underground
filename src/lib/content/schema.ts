/**
 * The editable site content document — the single source of truth the public
 * site renders from and the dashboard edits. Persisted as JSON in S3 (content
 * bucket) with immutable version snapshots. See lib/content/store.ts.
 *
 * Shape mirrors the site's curated sections so the dashboard can drive every
 * visible string/image. NAP/socials/identity live in `settings` (shared by the
 * header, footer and several sections); per-section copy lives on each section.
 */

export const SCHEMA_VERSION = 1;

export type Cta = { label: string; href: string };

/** Catalog of curated section types (the "blocks" the owner can add/remove). */
export const SECTION_TYPES = [
  "hero",
  "marquee",
  "nights",
  "gallery",
  "ethos",
  "visit",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

// — Per-section content —

export type HeroMedia = { poster: string; webm: string; mp4: string };

export type HeroSection = {
  type: "hero";
  titleTop: string;
  titleBottom: string;
  /** Supports a single {token} that renders with the Pride gradient. */
  subtitle: string;
  taglineLine: string;
  media: HeroMedia;
  ctaPrimary: Cta;
  ctaSecondary: Cta;
};

export type MarqueeSection = {
  type: "marquee";
  items: string[];
};

/** One of the per-night accent themes (maps to --color-night-<accent>). */
export const NIGHT_ACCENTS = ["trojajo", "trash", "damemas", "calling"] as const;
export type NightAccent = (typeof NIGHT_ACCENTS)[number];

export type NightItem = {
  id: string;
  name: string;
  emoji: string;
  day: string;
  cadence: string;
  tagline: string;
  blurb: string;
  accent: NightAccent;
};

export type NightsSection = {
  type: "nights";
  eyebrow: string;
  heading: string;
  intro: string;
  items: NightItem[];
};

export type GalleryImage = { id: string; src: string; alt: string };

export type GallerySection = {
  type: "gallery";
  eyebrow: string;
  heading: string;
  intro: string;
  images: GalleryImage[];
  /** Supports {handle} token → settings.socials.instagramHandle. */
  ctaLabel: string;
};

export type EthosSection = {
  type: "ethos";
  soul: string;
  body: string;
  badges: string[];
};

export type VisitHour = { id: string; label: string; value: string };

export type VisitSection = {
  type: "visit";
  hoursEyebrow: string;
  hoursHeading: string;
  hours: VisitHour[];
  hoursNote: string;
  placeEyebrow: string;
  placeHeading: string;
  mapsCtaLabel: string;
};

export type SectionData =
  | HeroSection
  | MarqueeSection
  | NightsSection
  | GallerySection
  | EthosSection
  | VisitSection;

/** A section as stored on the page: its content + a stable id + on/off flag. */
export type Section = SectionData & { id: string; enabled: boolean };

// — Global settings (shared across the page) —

export type Identity = {
  name: string;
  shortName: string;
  since: string;
  city: string;
  tagline: string;
};

export type Nap = {
  street: string;
  postalCode: string;
  locality: string;
  province: string;
  region: string;
  country: string;
  phone: string;
  email: string;
  mapsUrl: string;
};

export type Socials = {
  instagram: string;
  instagramHandle: string;
  facebook: string;
  tiktok: string;
};

export type Settings = {
  identity: Identity;
  nap: Nap;
  socials: Socials;
};

export type SiteContent = {
  schemaVersion: number;
  settings: Settings;
  sections: Section[];
};

// — Versioning —

export type VersionMeta = {
  id: string;
  label?: string;
  publishedAt: string; // ISO
};

export type VersionSnapshot = {
  meta: VersionMeta;
  content: SiteContent;
};

/** Narrow a section to a given type (handy in the editor + shell). */
export function isSection<T extends SectionType>(
  s: Section,
  type: T,
): s is Extract<Section, { type: T }> {
  return s.type === type;
}

/** Phone number → tel: href (strip spaces). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
