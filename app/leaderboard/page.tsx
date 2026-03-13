import { Section } from "@/components/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listProjects } from "@/lib/db/projects";
import { Trophy, TrendingUp, Eye, Heart, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const projects = await listProjects({ sort: "highest_score" });
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const weekly = projects
    .filter((p) => new Date(p.createdAt) >= since)
    .sort((a, b) => {
      const aScore = (a.aiScore ?? 0) * 2 + a.likes + a.views * 0.1;
      const bScore = (b.aiScore ?? 0) * 2 + b.likes + b.views * 0.1;
      return bScore - aScore;
    })
    .slice(0, 20);

  const projectOfWeek = weekly[0];

  return (
    <Section>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--amber-muted)] text-[var(--amber)]">
          <Trophy size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Weekly Leaderboard
          </h1>
          <p className="text-sm text-[var(--text-dim)]">
            Top launches from the last 7 days.
          </p>
        </div>
      </div>

      {projectOfWeek && (
        <Card padding="lg" className="mb-8 border-[var(--amber-border-soft)] bg-[var(--amber-muted)]/40">
          <div className="flex items-center gap-3">
            <Badge variant="warning" className="gap-1.5">
              <Star size={12} />
              Project of the Week
            </Badge>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              {projectOfWeek.name}
            </h2>
          </div>
          <p className="mt-3 text-sm text-[var(--text-secondary)] line-clamp-2">
            {projectOfWeek.description}
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {weekly.length === 0 ? (
          <Card padding="lg">
            <p className="text-sm text-[var(--text-secondary)]">
              No weekly projects yet.
            </p>
          </Card>
        ) : (
          weekly.map((project, index) => (
            <Card key={project.id} padding="md">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-[var(--text-dim)]">#{index + 1}</p>
                  <p className="truncate text-base font-semibold text-[var(--text-main)]">
                    {project.name}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp size={13} />
                    {project.aiScore ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart size={13} />
                    {project.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye size={13} />
                    {project.views}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Section>
  );
}
