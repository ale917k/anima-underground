/**
 * Ambient neon "blobs" that slowly drift behind everything — the core of the
 * "anti-spoglio" rule: the dark base is never dead, there's always movement and
 * colour breathing underneath. Pure CSS (no JS), respects reduced-motion.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      {/* magenta */}
      <div className="animate-drift-a absolute top-[-15%] -left-[10%] h-[55vh] w-[55vh] rounded-full bg-neon-magenta opacity-25 blur-[120px]" />
      {/* cyan */}
      <div className="animate-drift-b absolute top-[10%] right-[-12%] h-[50vh] w-[50vh] rounded-full bg-neon-cyan opacity-20 blur-[120px]" />
      {/* violet */}
      <div className="animate-drift-a absolute bottom-[-20%] left-[20%] h-[60vh] w-[60vh] rounded-full bg-neon-violet opacity-20 blur-[140px]" />
      {/* subtle vignette to keep edges deep */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--color-void)_100%)]" />
    </div>
  );
}
