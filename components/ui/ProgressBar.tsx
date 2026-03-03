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
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="text-[var(--text-dim)]">{label}</span>}
          {showPercent && (
            <span className="font-medium text-[var(--text-secondary)]">
              {percent}%
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(176,176,176,0.08)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
