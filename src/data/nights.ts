/**
 * The recurring "named nights" — the brand's real assets.
 * Source: research dossier §3. Copy is in their authentic, camp IG voice.
 *
 * `accentVar` maps to a --color-night-* token (see globals.css).
 * In Phase 3 these become rows in the `nights` table (owner-editable).
 */

export type Night = {
  slug: string;
  name: string;
  emoji: string;
  day: string; // human label
  cadence: string; // e.g. "Ogni venerdì"
  tagline: string; // short, punchy, their voice
  blurb: string; // one or two sentences
  accentVar: string; // CSS var for the accent color
};

export const nights: Night[] = [
  {
    slug: "trojajo",
    name: "TROJAJO",
    emoji: "💦",
    day: "Venerdì",
    cadence: "Ogni venerdì",
    tagline: "Il venerdì ignorante dell'Anima",
    blurb:
      "Aperitivo dalle 18, poi si scende. Niente filtri, solo hit, glitter e gente come te. Vi era un po' mancato, eh?",
    accentVar: "--color-night-trojajo",
  },
  {
    slug: "anima-trash",
    name: "ANIMA TRASH",
    emoji: "👑",
    day: "Sabato",
    cadence: "Un sabato al mese",
    tagline: "Drag, trash & chic",
    blurb:
      "Il collettivo veneziano TRASH & CHIC sbarca a Padova: drag show, regine e una delle serate più attese della città. Ingresso libero.",
    accentVar: "--color-night-trash",
  },
  {
    slug: "dame-mas",
    name: "DAME MÁS",
    emoji: "🔥",
    day: "Sabato",
    cadence: "Serata latina",
    tagline: "Reggaeton & ritmo latino",
    blurb:
      "Perreo fino a tardi. Il sabato più caliente del Veneto, tra reggaeton, latino e tanta, tantissima energia.",
    accentVar: "--color-night-damemas",
  },
  {
    slug: "anima-is-calling",
    name: "ANIMA IS CALLING",
    emoji: "🎶",
    day: "Mercoledì",
    cadence: "Infrasettimanale",
    tagline: "Per chi le serate le fa",
    blurb:
      "La notte di metà settimana pensata per gli insider della scena. Quando l'Anima chiama, si risponde.",
    accentVar: "--color-night-calling",
  },
];
