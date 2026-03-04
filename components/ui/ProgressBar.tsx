type ProgressBarProps = {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  max,
  label,
  showPercent = true,
  className = "",
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className={className}>
      {label && (
        <div className="mb-2 text-xs text-[var(--text-secondary)]">
          {label}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showPercent && (
        <div className="mt-1.5 text-right text-xs font-medium text-[var(--text-dim)]">
          {percent}% funded
        </div>
      )}
    </div>
  );
}
