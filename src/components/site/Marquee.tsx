/**
 * A scrolling tagline strip with a Pride top/bottom edge. Pure CSS marquee,
 * duplicated content for a seamless loop; pauses for reduced-motion users.
 */
const ITEMS = [
  "TROJAJO 💦",
  "ANIMA TRASH 👑",
  "DAME MÁS 🔥",
  "DRAG SHOW",
  "BE YOURSELF 🌈",
  "MUSIC · DANCE · DRINKS",
  "INGRESSO LIBERO",
  "ANIMA IS CALLING 🎶",
];

export function Marquee() {
  const line = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-line py-4">
      <div className="bg-pride absolute inset-x-0 top-0 h-px opacity-70" />
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {line.map((t, i) => (
          <span
            key={i}
            className="font-display text-sm font-medium tracking-[0.25em] text-ink-dim uppercase"
          >
            {t}
            <span className="ml-10 text-neon-magenta">✦</span>
          </span>
        ))}
      </div>
      <div className="bg-pride absolute inset-x-0 bottom-0 h-px opacity-70" />
    </div>
  );
}
