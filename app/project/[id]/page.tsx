import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ShareButton } from "@/components/ShareButton";
import { ViewTracker } from "@/components/ViewTracker";
import { getProjectById } from "@/lib/db/projects";
import { CATEGORY_LABELS } from "@/lib/constants";
import {
  ArrowLeft,
  Eye,
  Globe,
  ShieldCheck,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { LikeButton } from "@/components/LikeButton";
import { ProjectTokenSection } from "@/components/ProjectTokenSection";
import { CreatorIdentity } from "@/components/CreatorIdentity";
import { ProjectSwapWidget } from "@/components/ProjectSwapWidget";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

const statusVariantMap: Record<
  string,
  "success" | "info" | "default" | "danger"
> = {
  Live: "success",
  Upcoming: "info",
  Draft: "default",
  Ended: "danger",
};

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return { title: "Project Not Found | LaunchForge" };
  }

  const title = `${project.name} — LaunchForge`;
  const description = project.description.slice(0, 160);
  const url = `${appUrl}/project/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "LaunchForge",
      type: "website",
      images: [
        {
          url: project.logoUrl ?? `${appUrl}/images/launchforge-icon.png`,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.logoUrl ?? `${appUrl}/images/launchforge-icon.png`],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: project.logoUrl ?? `${appUrl}/images/launchforge-icon.png`,
        button: {
          title: `View ${project.name}`,
          action: {
            type: "launch_miniapp",
            name: "LaunchForge",
            url: `${appUrl}/project/${id}`,
            splashImageUrl: `${appUrl}/images/launchforge-icon.png`,
            splashBackgroundColor: "#0B0F19",
          },
        },
      }),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

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
    tokenAddress,
    tokenSupply,
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
    <section className="py-12 sm:py-16">
      <Container>
        <ViewTracker projectId={id} />
        {/* Back link */}
        <Link
          href="/explore"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft size={16} />
          Back to Explore
        </Link>

        {/* Two column layout */}
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_400px]">
          {/* ── Left Column ─────────────────── */}
          <div className="min-w-0 space-y-10">
            {/* Header */}
            <Card padding="lg" className="relative overflow-hidden fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-muted)] via-transparent to-transparent opacity-50" />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
                      {name}
                    </h1>
                    {tokenSymbol && (
                      <span className="rounded-full bg-[var(--bg-elevated)] px-3 py-1 text-sm font-medium text-[var(--text-secondary)]">
                        ${tokenSymbol}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Badge
                      variant={statusVariantMap[status] ?? "default"}
                      dot
                    >
                      {status}
                    </Badge>
                    <span className="text-sm text-[var(--text-dim)]">
                      {CATEGORY_LABELS[category] ?? category}
                    </span>
                    <span className="text-[var(--text-dim)]">·</span>
                    <span className="flex items-center gap-1.5 text-sm text-[var(--text-dim)]">
                      <Calendar size={13} />
                      {launchedDate}
                    </span>
                  </div>
                </div>
                <ScoreBadge score={aiScore} size="lg" />
              </div>
            </Card>

            {/* Project Overview */}
            <Card padding="lg">
              <div className="rounded-2xl border border-[var(--border)]/80 bg-[var(--bg-elevated)] p-4 sm:p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  About
                </h2>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base sm:leading-relaxed">
                  {description}
                </p>

                {fundingTarget && fundingTarget > 0 && (
                  <>
                    <div className="my-6 h-px bg-[var(--border)]" />
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                      Funding Goal
                    </h3>
                    <div className="mb-4 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-[var(--text-main)]">
                        ${(fundingRaised ?? 0).toLocaleString()}
                      </span>
                      <span className="text-sm text-[var(--text-dim)]">
                        of ${fundingTarget.toLocaleString()} USDC
                      </span>
                    </div>
                    <ProgressBar
                      value={fundingRaised ?? 0}
                      max={fundingTarget}
                      showPercent={true}
                    />
                  </>
                )}

                <div className="my-6 h-px bg-[var(--border)]" />
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  Details
                </h3>
                <dl className="space-y-5">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-[var(--text-dim)]">Creator</dt>
                    <dd className="max-w-[65%] truncate">
                      <CreatorIdentity
                        address={creator as `0x${string}`}
                        displayName={project.creatorDisplayName ?? undefined}
                        username={project.creatorUsername ?? undefined}
                        pfpUrl={project.creatorPfpUrl ?? undefined}
                        size="sm"
                        linkToBaseProfile
                      />
                    </dd>
                  </div>
                  <div className="h-px bg-[var(--border)]" />
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-[var(--text-dim)]">
                      Engagement
                    </dt>
                    <dd className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <LikeButton projectId={id} initialLikes={likes} />
                      <span className="flex items-center gap-1.5">
                        <Eye size={14} className="text-[var(--accent)]" />
                        {views.toLocaleString()} views
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="my-6 h-px bg-[var(--border)]" />
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  Links
                </h3>
                <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1">
                  <ShareButton
                    projectId={id}
                    projectName={name}
                    variant="full"
                  />
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition-all duration-150 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)]"
                    >
                      <Globe size={16} />
                      <span className="hidden sm:inline">Website</span>
                    </a>
                  )}
                  {twitter && (
                    <a
                      href={twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition-all duration-150 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)]"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="hidden sm:inline">Twitter / X</span>
                    </a>
                  )}
                  {github && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition-all duration-150 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)]"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="hidden sm:inline">GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* ── Right Column (Sidebar) ──────── */}
          <div className="min-w-0 space-y-8">
            {/* AI Analysis */}
            <Card padding="lg">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                AI Analysis
              </h2>
              {aiScore !== undefined ? (
                <div>
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={aiScore} size="lg" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck
                          size={16}
                          className="text-[var(--green)]"
                        />
                        <p className="text-sm font-semibold text-[var(--text-main)]">
                          {aiScore >= 80
                            ? "Strong Project"
                            : aiScore >= 60
                              ? "Moderate Confidence"
                              : "Needs Review"}
                        </p>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-dim)]">
                        Based on wallet history, tokenomics, and community
                        signals
                      </p>
                    </div>
                  </div>
                  {riskFlags && riskFlags.length > 0 && (
                    <div className="mt-5 border-t border-[var(--border)] pt-4">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[var(--text-dim)]">
                        <AlertTriangle size={13} />
                        Risk Flags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {riskFlags.map((flag) => (
                          <Badge key={flag} variant="warning">
                            {flag.replace(/-/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-[var(--bg-elevated)] p-5 text-center">
                  <p className="text-sm text-[var(--text-dim)]">
                    AI analysis pending — submitted projects are scored
                    automatically.
                  </p>
                </div>
              )}
            </Card>

            {/* Token */}
            <ProjectTokenSection
              projectId={id}
              projectName={name}
              tokenSymbol={tokenSymbol}
              tokenAddress={tokenAddress}
              tokenSupply={tokenSupply}
              creatorWallet={creator}
            />

            {tokenAddress && (
              <ProjectSwapWidget
                tokenAddress={tokenAddress}
                tokenSymbol={tokenSymbol}
                tokenName={name}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
