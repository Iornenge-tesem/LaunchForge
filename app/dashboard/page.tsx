"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { useMiniAppProfile } from "@/components/providers";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { LaunchProject } from "@/lib/types";
import {
  Rocket,
  Eye,
  Heart,
  ExternalLink,
  LayoutDashboard,
  Plus,
  Wallet,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const statusVariantMap: Record<string, "success" | "info" | "default" | "danger"> = {
  Live: "success",
  Upcoming: "info",
  Draft: "default",
  Ended: "danger",
};

export default function DashboardPage() {
  const { address, isConnected } = useMiniAppProfile();
  const [projects, setProjects] = useState<LaunchProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/projects/mine?wallet=${encodeURIComponent(address)}`
      );
      const json = await res.json();
      if (json.ok) setProjects(json.projects);
    } catch {
      // keep previous
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) fetchMyProjects();
    else setLoading(false);
  }, [address, fetchMyProjects]);

  // Aggregate stats
  const totalViews = projects.reduce((s, p) => s + p.views, 0);
  const totalLikes = projects.reduce((s, p) => s + p.likes, 0);
  const totalFunding = projects.reduce((s, p) => s + (p.fundingRaised ?? 0), 0);
  const liveCount = projects.filter((p) => p.status === "Live").length;

  // Not connected state
  if (!isConnected) {
    return (
      <Section narrow>
        <Card padding="lg" className="mx-auto max-w-lg text-center fade-in-up">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-muted)]">
            <Wallet size={28} className="text-[var(--accent)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">
            Connect Your Wallet
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Your wallet is auto-connecting. Once connected, you&apos;ll see all
            your launched projects here.
          </p>
        </Card>
      </Section>
    );
  }

  return (
    <Section>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)]">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              My Projects
            </h1>
            <p className="text-sm text-[var(--text-dim)]">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
        <Link href="/launch">
          <Button size="md" className="gap-2">
            <Plus size={16} />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card padding="sm" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
            <Rocket size={16} />
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--text-main)]">{projects.length}</p>
            <p className="text-xs text-[var(--text-dim)]">Projects</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--green-muted)] text-[var(--green)]">
            <TrendingUp size={16} />
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--text-main)]">{liveCount}</p>
            <p className="text-xs text-[var(--text-dim)]">Live</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--purple-muted)] text-[var(--purple)]">
            <Eye size={16} />
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--text-main)]">
              {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}
            </p>
            <p className="text-xs text-[var(--text-dim)]">Views</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--red-muted)] text-[var(--red)]">
            <Heart size={16} />
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--text-main)]">{totalLikes}</p>
            <p className="text-xs text-[var(--text-dim)]">Likes</p>
          </div>
        </Card>
      </div>

      {/* Funding summary */}
      {totalFunding > 0 && (
        <Card padding="md" className="mb-8 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--amber-muted)] text-[var(--amber)]">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-dim)]">Total Funding Raised</p>
            <p className="text-xl font-bold text-[var(--text-main)]">
              ${totalFunding.toLocaleString()} <span className="text-sm font-normal text-[var(--text-dim)]">USDC</span>
            </p>
          </div>
        </Card>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shimmer rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-1/3 shimmer rounded-lg" />
                  <div className="h-4 w-1/2 shimmer rounded-md" />
                </div>
                <div className="h-8 w-8 shimmer rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-elevated)]">
            <Rocket size={28} className="text-[var(--text-dim)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            No projects yet
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Launch your first project and it will appear here.
          </p>
          <div className="mt-6">
            <Link href="/launch">
              <Button size="md" className="gap-2">
                <Rocket size={16} />
                Launch Project
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group block"
            >
              <Card padding="md" hover className="transition-all duration-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <ScoreBadge score={project.aiScore} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-[var(--text-main)]">
                          {project.name}
                        </h3>
                        {project.tokenSymbol && (
                          <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                            ${project.tokenSymbol}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <Badge variant={statusVariantMap[project.status] ?? "default"} dot>
                          {project.status}
                        </Badge>
                        <span className="text-xs text-[var(--text-dim)]">
                          {CATEGORY_LABELS[project.category] ?? project.category}
                        </span>
                        <span className="text-[var(--text-dim)]">·</span>
                        <span className="text-xs text-[var(--text-dim)]">
                          {new Date(project.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: stats + action */}
                  <div className="flex items-center gap-5 sm:gap-6">
                    <div className="flex items-center gap-4 text-xs text-[var(--text-dim)]">
                      <span className="flex items-center gap-1">
                        <Eye size={13} />
                        {project.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={13} />
                        {project.likes}
                      </span>
                    </div>
                    {project.fundingTarget && project.fundingTarget > 0 && (
                      <div className="hidden w-28 sm:block">
                        <ProgressBar
                          value={project.fundingRaised ?? 0}
                          max={project.fundingTarget}
                          showPercent={false}
                        />
                      </div>
                    )}
                    <ExternalLink
                      size={16}
                      className="shrink-0 text-[var(--text-dim)] transition-colors group-hover:text-[var(--accent)]"
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
