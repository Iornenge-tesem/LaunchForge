import Link from "next/link";
import { Section } from "@/components/Section";
import { GlowBackground } from "@/components/ui/GlowBackground";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProjectCard } from "@/components/ProjectCard";
import { getTopProjects, mockProjects } from "@/lib/projects";
import { Badge } from "@/components/ui/Badge";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Launch Tokens",
    desc: "Deploy ERC-20 tokens with built-in anti-rug mechanics, liquidity locks, and vesting schedules — all on Base.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "AI Analysis",
    desc: "Every project gets an AI-powered reputation score, risk analysis, and community trust signal before launch.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Discover Builders",
    desc: "Browse serious projects from verified builders. Ratings, engagement, and community feedback at a glance.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    title: "Micro-Payments",
    desc: "USDC-powered x402 payments for project creation and premium analytics. Pay only for what you use.",
  },
];

const stats = [
  { label: "Projects Launched", value: mockProjects.length.toString() },
  {
    label: "Total Funding",
    value:
      "$" +
      mockProjects
        .reduce((sum, p) => sum + (p.fundingRaised ?? 0), 0)
        .toLocaleString(),
  },
  {
    label: "Live Projects",
    value: mockProjects.filter((p) => p.status === "Live").length.toString(),
  },
];

export default function Home() {
  const topProjects = getTopProjects(3);

  return (
    <div className="relative isolate overflow-hidden">
      <GlowBackground />

      {/* ── Hero ──────────────────────────────── */}
      <Section className="relative z-10 pt-16 pb-6 sm:pt-24 sm:pb-10">
        <div className="mx-auto max-w-2xl text-center fade-in-up">
          <Badge variant="info" className="mb-5">
            Built on Base
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)] sm:text-5xl">
            The launchpad for
            <br />
            <span className="text-[var(--accent)]">serious builders.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Launch tokens, get AI analysis, and discover real crypto projects.
            Built for builders who ship.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/launch">
              <Button size="lg" fullWidth className="sm:w-auto">
                Launch Project
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="secondary" size="lg" fullWidth className="sm:w-auto">
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ── Stats ─────────────────────────────── */}
      <Section className="relative z-10 py-6 sm:py-8">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center sm:p-4"
            >
              <div className="text-lg font-bold text-[var(--text-main)] sm:text-2xl">
                {stat.value}
              </div>
              <div className="mt-0.5 text-xs text-[var(--text-dim)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Features ──────────────────────────── */}
      <Section className="relative z-10 py-8 sm:py-12">
        <h2 className="mb-6 text-center text-xl font-semibold text-[var(--text-main)] sm:text-2xl">
          Everything you need to launch
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title} hover padding="md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-muted)]">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-dim)]">
                {f.desc}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Top Projects ──────────────────────── */}
      <Section className="relative z-10 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--text-main)] sm:text-2xl">
            Top Projects
          </h2>
          <Link
            href="/explore"
            className="text-sm text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      {/* ── CTA ───────────────────────────────── */}
      <Section className="relative z-10 py-10 sm:py-14">
        <Card padding="lg" className="text-center">
          <h2 className="text-xl font-bold text-[var(--text-main)] sm:text-2xl">
            Ready to build?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-dim)]">
            Launch your project on Base in minutes. Get AI-powered analysis and
            reach serious crypto builders.
          </p>
          <div className="mt-6">
            <Link href="/launch">
              <Button size="lg">Start Building</Button>
            </Link>
          </div>
        </Card>
      </Section>
    </div>
  );
}
