import Link from "next/link";
import type { LaunchProject } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CATEGORY_LABELS } from "@/lib/constants";

type StatusVariant = "success" | "info" | "default" | "danger";

const statusVariantMap: Record<string, StatusVariant> = {
  Live: "success",
  Upcoming: "info",
  Draft: "default",
  Ended: "danger",
};

export function ProjectCard({ project }: { project: LaunchProject }) {
  const {
    id,
    name,
    description,
    creator,
    status,
    category,
    tokenSymbol,
    aiScore,
    likes,
    views,
    fundingTarget,
    fundingRaised,
  } = project;

  return (
    <Link
      href={`/project/${id}`}
      className="group flex flex-col rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)] hover:shadow-[0_2px_24px_rgba(0,0,0,0.3)] sm:p-5"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-[var(--text-main)]">
              {name}
            </h3>
            {tokenSymbol && (
              <span className="shrink-0 text-xs font-medium text-[var(--text-dim)]">
                ${tokenSymbol}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge variant={statusVariantMap[status] ?? "default"} dot>
              {status}
            </Badge>
            <span className="text-xs text-[var(--text-dim)]">
              {CATEGORY_LABELS[category] ?? category}
            </span>
          </div>
        </div>
        <ScoreBadge score={aiScore} />
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--text-dim)]">
        {description}
      </p>

      {/* Funding progress */}
      {fundingTarget && fundingTarget > 0 && (
        <div className="mt-4">
          <ProgressBar
            value={fundingRaised ?? 0}
            max={fundingTarget}
            label={`$${(fundingRaised ?? 0).toLocaleString()} / $${fundingTarget.toLocaleString()} USDC`}
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-[var(--text-dim)]">
        <span className="truncate">{creator}</span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 3.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>
            {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
          </span>
        </div>
      </div>
    </Link>
  );
}
