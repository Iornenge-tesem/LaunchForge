export function HammerLoader() {
  return (
    <div className="lf-hammer-loader" aria-label="Loading LaunchForge" role="status">
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="lf-torso">
          <path d="M52 118 C60 95 78 84 95 88 C109 91 119 103 122 120" className="lf-stroke" />
          <path d="M70 96 C73 88 82 82 92 82" className="lf-stroke" />
        </g>

        <g className="lf-arm" transform="translate(92 90)">
          <path d="M0 0 C9 3 16 9 19 17" className="lf-stroke" />
          <path d="M19 17 L47 -6" className="lf-stroke" />
          <path d="M45 -9 L59 -15" className="lf-stroke" />
          <path d="M59 -15 L64 -5" className="lf-stroke" />
          <path d="M64 -5 L50 0" className="lf-stroke" />
        </g>

        <circle className="lf-spark" cx="137" cy="115" r="2.6" />
      </svg>
    </div>
  );
}
