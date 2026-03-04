import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { GlowBackground } from "@/components/ui/GlowBackground";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { getTopProjects, mockProjects } from "@/lib/projects";
import minikitConfig from "@/minikit.config";
import {
  Rocket,
  DollarSign,
  Radio,
  Zap,
  Brain,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: minikitConfig.appName,
  description: minikitConfig.description,
  openGraph: {
    title: minikitConfig.ogTitle,
    description: minikitConfig.ogDescription,
    url: minikitConfig.homeUrl,
    images: [
      {
        url: minikitConfig.iconUrl,
        width: 1200,
        height: 1200,
        alt: `${minikitConfig.appName} app icon`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: minikitConfig.ogTitle,
    description: minikitConfig.ogDescription,
    images: [minikitConfig.iconUrl],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: minikitConfig.iconUrl,
      button: {
        title: "Launch Project",
        action: {
          type: "launch_frame",
          name: `Launch ${minikitConfig.appName}`,
          url: minikitConfig.homeUrl,
          splashImageUrl: minikitConfig.splashImageUrl,
          splashBackgroundColor: minikitConfig.splashBackgroundColor,
        },
      },
    }),
  },
};

const features = [
  {
    icon: <Zap size={22} />,
    title: "Launch Tokens",
    desc: "Deploy ERC-20 tokens with built-in anti-rug mechanics, liquidity locks, and vesting schedules — all on Base.",
  },
  {
    icon: <Brain size={22} />,
    title: "AI Analysis",
    desc: "Every project gets an AI-powered reputation score, risk analysis, and community trust signal before launch.",
  },
  {
    icon: <Users size={22} />,
    title: "Discover Builders",
    desc: "Browse serious projects from verified builders. Ratings, engagement, and community feedback at a glance.",
  },
];

const stats = [
  {
    icon: <Rocket size={20} />,
    label: "Projects Launched",
    value: mockProjects.length.toString(),
  },
  {
    icon: <DollarSign size={20} />,
    label: "Total Funding",
    value:
      "$" +
      mockProjects
        .reduce((sum, p) => sum + (p.fundingRaised ?? 0), 0)
        .toLocaleString(),
  },
  {
    icon: <Radio size={20} />,
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
      <Section className="relative z-10 pt-16 pb-4 sm:pt-24 sm:pb-6">
        <div className="mx-auto max-w-2xl text-center fade-in-up">
          <Badge variant="info" className="mb-5">
            Built on Base
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-[56px] sm:leading-[1.08]">
            The launchpad for
            <br />
            <span className="text-[var(--accent)]">serious builders.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg sm:mt-5">
            Launch tokens, get AI analysis, and discover real crypto projects —
            all on Base.
          </p>
        </div>
      </Section>

      {/* ── Stats ─────────────────────────────── */}
      <Section className="relative z-10 py-8 sm:py-10">
        <div className="mx-auto grid max-w-[800px] grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              padding="md"
              className="flex items-center gap-4 dark:bg-[color:rgba(34,34,34,0.92)] dark:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text-main)]">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--text-dim)]">
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── CTA Button ────────────────────────── */}
      <Section className="relative z-10 py-8 sm:py-10">
        <div className="flex justify-center">
          <Link href="/launch">
            <Button size="lg" className="gap-2.5 px-8 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]">
              <Rocket size={18} />
              Launch Project
            </Button>
          </Link>
        </div>
      </Section>

      {/* ── Features ──────────────────────────── */}
      <Section className="relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Everything you need to launch
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] sm:text-base">
            From token deployment to community discovery — we&apos;ve got you
            covered.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              hover
              padding="lg"
              className="flex flex-col dark:bg-[color:rgba(34,34,34,0.9)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-[var(--text-main)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {f.desc}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Top Projects ──────────────────────── */}
      <Section className="relative z-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              Top Projects
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Highest-rated projects by our AI scoring system.
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)] sm:flex"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/explore">
            <Button variant="secondary" size="sm" className="gap-2">
              View all projects
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </Section>

      {/* ── CTA ───────────────────────────────── */}
      <Section className="relative z-10 pb-16 sm:pb-20">
        <Card
          padding="lg"
          className="text-center dark:bg-[color:rgba(34,34,34,0.94)] dark:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.6)]"
        >
          <h2 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Ready to build?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)] sm:text-base">
            Launch your project on Base in minutes. Get AI-powered analysis and
            reach serious crypto builders.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/launch">
              <Button size="lg" className="gap-2">
                <Rocket size={18} />
                Start Building
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="secondary" size="lg">
                Explore Projects
              </Button>
            </Link>
          </div>
        </Card>
      </Section>
    </div>
  );
}
