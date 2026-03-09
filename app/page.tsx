import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { GlowBackground } from "@/components/ui/GlowBackground";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { listProjects } from "@/lib/db/projects";
import minikitConfig from "@/minikit.config";
import {
  Rocket,
  DollarSign,
  Radio,
  Zap,
  Brain,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";

export const dynamic = "force-dynamic";

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
          type: "launch_miniapp",
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
    color: "text-[var(--accent)]",
    bg: "bg-[var(--accent-muted)]",
  },
  {
    icon: <Brain size={22} />,
    title: "AI Analysis",
    desc: "Every project gets an AI-powered reputation score, risk analysis, and community trust signal before launch.",
    color: "text-[var(--purple)]",
    bg: "bg-[var(--purple-muted)]",
  },
  {
    icon: <Shield size={22} />,
    title: "Trust & Safety",
    desc: "Every project is scored for risk. Community ratings, engagement metrics, and on-chain verification built in.",
    color: "text-[var(--green)]",
    bg: "bg-[var(--green-muted)]",
  },
];

export default async function Home() {
  const projects = await listProjects();
  const topProjects = [...projects]
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
    .slice(0, 3);

  const stats = [
    {
      icon: <Rocket size={20} />,
      label: "Projects Launched",
      value: projects.length.toString(),
    },
    {
      icon: <DollarSign size={20} />,
      label: "Total Funding",
      value:
        "$" +
        projects
          .reduce((sum, p) => sum + (p.fundingRaised ?? 0), 0)
          .toLocaleString(),
    },
    {
      icon: <Radio size={20} />,
      label: "Live Projects",
      value: projects.filter((p) => p.status === "Live").length.toString(),
    },
  ];

  return (
    <div className="relative isolate overflow-hidden">
      <GlowBackground />

      {/* ── Hero ──────────────────────────────── */}
      <Section className="relative z-10 pt-20 pb-6 sm:pt-28 sm:pb-10">
        <div className="mx-auto max-w-2xl text-center fade-in-up">
          <Badge variant="info" className="mb-6 gap-1.5">
            <Sparkles size={12} />
            Built on Base
          </Badge>
          <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-tight text-[var(--text-main)] sm:text-[3.5rem] sm:leading-[1.08]">
            The launchpad for{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--purple)] bg-clip-text text-transparent">
              serious builders
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg sm:mt-6">
            Launch tokens, get AI-powered analysis, and connect with real crypto
            builders — all on Base.
          </p>
          <div className="mt-8 flex flex-row items-center justify-center gap-3">
            <Link href="/launch">
              <Button size="lg" className="gap-2.5 px-8 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]">
                <Rocket size={18} />
                Launch Project
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="secondary" size="lg" className="gap-2">
                Explore Projects
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ── Stats ─────────────────────────────── */}
      <Section className="relative z-10 py-8 sm:py-12">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} padding="md" className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
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

      {/* ── Features ──────────────────────────── */}
      <Section className="relative z-10">
        <div className="mb-12 text-center">
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
            <Card key={f.title} hover padding="lg" className="flex flex-col">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${f.bg} ${f.color}`}>
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
      <Section className="relative z-10 pb-16 sm:pb-24">
        <Card padding="lg" className="relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-muted)] via-transparent to-[var(--purple-muted)] opacity-40" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              Ready to build?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)] sm:text-base">
              Launch your project on Base in minutes. Get AI-powered analysis and
              reach serious crypto builders.
            </p>
            <div className="mt-8 flex flex-row items-center justify-center gap-3">
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
          </div>
        </Card>
      </Section>
    </div>
  );
}
