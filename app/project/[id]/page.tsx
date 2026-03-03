import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { findProjectById } from "@/lib/projects";
import { CATEGORY_LABELS } from "@/lib/constants";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

const statusVariantMap: Record<string, "success" | "info" | "default" | "danger"> = {
  Live: "success",
  Upcoming: "info",
  Draft: "default",
  Ended: "danger",
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = findProjectById(id);

  if (!project) {
    notFound();
  }

  const {
    name,
    description,
    creator,
    status,
    category,
    tokenSymbol,
    website,
    twitter,
    github,
    aiScore,
    riskFlags,
    likes,
    views,
    fundingTarget,
    fundingRaised,
    createdAt,
  } = project;

  const launchedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Section narrow>
      {/* Back link */}
      <Link
        href="/explore"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--text-dim)] transition-colors hover:text-[var(--accent)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Explore
      </Link>

      {/* Project header card */}
      <Card padding="lg" className="fade-in-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
                {name}
              </h1>
              {tokenSymbol && (
                <span className="text-sm font-medium text-[var(--text-dim)]">
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
              <span className="text-xs text-[var(--text-dim)]">·</span>
              <span className="text-xs text-[var(--text-dim)]">
                {launchedDate}
              </span>
            </div>
          </div>
          <ScoreBadge score={aiScore} size="md" />
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>

        {/* Funding */}
        {fundingTarget && fundingTarget > 0 && (
          <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-main)] p-4">
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="font-medium text-[var(--text-main)]">
                ${(fundingRaised ?? 0).toLocaleString()} USDC
              </span>
              <span className="text-[var(--text-dim)]">
                of ${fundingTarget.toLocaleString()} goal
              </span>
            </div>
            <ProgressBar value={fundingRaised ?? 0} max={fundingTarget} showPercent={false} />
          </div>
        )}
      </Card>

      {/* Info grid */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* Details */}
        <Card padding="md">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Details
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-[var(--text-dim)]">Creator</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--text-main)]">
                {creator}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-dim)]">Engagement</dt>
              <dd className="mt-0.5 flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--red)]"><path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>
                  {likes} likes
                </span>
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--accent)]"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 3.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>
                  {views.toLocaleString()} views
                </span>
              </dd>
            </div>
          </dl>
        </Card>

        {/* Links */}
        <Card padding="md">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Links
          </h2>
          <div className="space-y-2.5">
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Website
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter / X
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
            )}
          </div>
        </Card>
      </div>

      {/* AI Analysis & Ratings */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card padding="md">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            AI Analysis
          </h2>
          {aiScore !== undefined ? (
            <div>
              <div className="flex items-center gap-3">
                <ScoreBadge score={aiScore} size="md" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-main)]">
                    {aiScore >= 80
                      ? "Strong Project"
                      : aiScore >= 60
                        ? "Moderate Confidence"
                        : "Needs Review"}
                  </p>
                  <p className="text-xs text-[var(--text-dim)]">
                    Based on wallet history, tokenomics, and community signals
                  </p>
                </div>
              </div>
              {riskFlags && riskFlags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {riskFlags.map((flag) => (
                    <Badge key={flag} variant="warning">
                      {flag.replace(/-/g, " ")}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-dim)]">
              AI analysis pending — submitted projects are scored automatically.
            </p>
          )}
        </Card>

        <Card padding="md">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Community Ratings
          </h2>
          <p className="text-sm text-[var(--text-dim)]">
            Community ratings will be available once the project goes live.
            Users can rate projects and leave feedback.
          </p>
          <div className="mt-3">
            <Button variant="secondary" size="sm" disabled>
              Rate This Project
            </Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}
