import Link from "next/link";
import { Section } from "@/components/Section";
import { GlowBackground } from "@/components/ui/GlowBackground";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { getTopProjects, mockProjects } from "@/lib/projects";
import {
  Rocket,
  DollarSign,
  Radio,
  Zap,
  Brain,
  Users,
  ArrowRight,
} from "lucide-react";

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
      <Section className="relative z-10 pt-20 pb-8 sm:pt-28 sm:pb-12">
        <div className="mx-auto max-w-2xl text-center fade-in-up">
          <Badge variant="info" className="mb-6">
            Built on Base
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-6xl sm:leading-[1.1]">
            The launchpad for
            <br />
            <span className="text-[var(--accent)]">serious builders.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Launch tokens, get AI analysis, and discover real crypto projects —
            all on Base.
          </p>
        </div>
      </Section>

      {/* ── Stats ─────────────────────────────── */}
      <Section className="relative z-10 py-0 sm:py-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} padding="md" className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-muted)] text-[var(--accent)]">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[var(--text-dim)]">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── CTA Button ────────────────────────── */}
      <Section className="relative z-10 py-8 sm:py-10">
        <div className="flex justify-center">
          <Link href="/launch">
            <Button size="lg" className="gap-2 px-8">
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
        <div className="grid gap-5 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} hover padding="lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-muted)] text-[var(--accent)]">
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
            className="hidden items-center gap-1 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)] sm:flex"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-6 flex justify-center sm:hidden">
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
        <Card padding="lg" className="text-center">
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
