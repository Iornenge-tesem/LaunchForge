type ScoreBadgeProps = {
  score: number | undefined;
  size?: "sm" | "md" | "lg";
};

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--green)";
  if (score >= 60) return "var(--amber)";
  if (score >= 40) return "var(--accent)";
  return "var(--red)";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "var(--green-muted)";
  if (score >= 60) return "var(--amber-muted)";
  if (score >= 40) return "var(--accent-muted)";
  return "var(--red-muted)";
}

function getLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Fair";
  return "Low";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
};

export function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
  if (score === undefined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-xs text-[var(--text-dim)]">
        N/A
      </span>
    );
  }

  return (
    <span
      className={`inline-flex flex-col items-center justify-center rounded-full font-bold ${sizeClasses[size]}`}
      style={{
        backgroundColor: getScoreBg(score),
        color: getScoreColor(score),
      }}
      title={`AI Score: ${score}/100 — ${getLabel(score)}`}
    >
      {score}
    </span>
  );
}
