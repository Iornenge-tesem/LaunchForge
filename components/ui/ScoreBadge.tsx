type ScoreBadgeProps = {
  score: number | undefined;
  size?: "sm" | "md";
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

export function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
  if (score === undefined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(176,176,176,0.08)] px-2 py-0.5 text-xs text-[var(--text-dim)]">
        — Not scored
      </span>
    );
  }

  const sizeClass = size === "md" ? "h-10 w-10 text-sm" : "h-7 w-7 text-xs";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold ${sizeClass}`}
      style={{
        backgroundColor: getScoreBg(score),
        color: getScoreColor(score),
      }}
      title={`AI Score: ${score}/100`}
    >
      {score}
    </span>
  );
}
