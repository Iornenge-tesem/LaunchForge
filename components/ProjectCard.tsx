import Link from "next/link";
import type { LaunchProject } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Heart, Eye, User } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

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
    creatorUsername,
    creatorDisplayName,
    creatorPfpUrl,
    status,
    category,
    tokenSymbol,
    aiScore,
    likes,
    views,
    fundingTarget,
    fundingRaised,
  } = project;

  const displayName =
    creatorDisplayName || (creatorUsername ? `@${creatorUsername}` : `${creator.slice(0, 6)}…${creator.slice(-4)}`);

  return (
    <Link
      href={`/project/${id}`}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 cursor-pointer sm:p-7"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="truncate text-base font-semibold text-[var(--text-main)]">
              {name}
            </h3>
            {tokenSymbol && (
              <span className="shrink-0 rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                ${tokenSymbol}
              </span>
            )}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
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
      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
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
        <div className="flex min-w-0 items-center gap-2">
          {creatorPfpUrl ? (
            <img
              src={creatorPfpUrl}
              alt={displayName}
              className="h-5 w-5 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
              <User size={10} />
            </span>
          )}
          <span className="truncate">{displayName}</span>
        </div>
        <div className="flex items-center gap-3.5 shrink-0">
          <span className="flex items-center gap-1">
            <Heart size={13} />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
          </span>
          <ShareButton projectId={id} projectName={name} variant="icon" />
        </div>
      </div>
    </Link>
  );
}
