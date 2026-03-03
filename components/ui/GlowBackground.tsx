export function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="forge-radial" />
      <div className="forge-grid" />
      <div className="forge-interactive-glow" />
    </div>
  );
}
