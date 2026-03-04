import Link from "next/link";
import type { LaunchProject } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Heart, Eye } from "lucide-react";

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
      className="group flex flex-col rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="truncate text-base font-semibold text-[var(--text-main)]">
              {name}
            </h3>
            {tokenSymbol && (
              <span className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                ${tokenSymbol}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
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
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>

      {/* Funding progress */}
      {fundingTarget && fundingTarget > 0 && (
        <div className="mt-5">
          <ProgressBar
            value={fundingRaised ?? 0}
            max={fundingTarget}
            label={`$${(fundingRaised ?? 0).toLocaleString()} / $${fundingTarget.toLocaleString()} USDC`}
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4 mt-5 text-xs text-[var(--text-dim)]">
        <span className="truncate font-mono">{creator}</span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
          </span>
        </div>
      </div>
    </Link>
  );
}
