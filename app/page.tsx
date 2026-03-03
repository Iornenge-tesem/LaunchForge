import Link from "next/link";
import { Section } from "@/components/Section";
import { GlowBackground } from "@/components/ui/GlowBackground";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <GlowBackground />
      <Section className="relative z-10 fade-in py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-[var(--text-main)] sm:text-6xl">LaunchForge</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--text-dim)] sm:text-xl">
            The launchpad for serious builders.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/launch" aria-label="Launch Project">
              <Button variant="primary">Launch Project</Button>
            </Link>
            <Link href="/explore" aria-label="Explore Projects">
              <Button variant="secondary">Explore Projects</Button>
            </Link>
          </div>
        </div>
      </Section>

      <Section className="relative z-10 pt-0">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            "Launch tokens",
            "Get AI analysis",
            "Discover serious projects",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border border-[rgba(148,163,184,0.2)] bg-[var(--bg-soft)] p-5 text-left text-sm text-[var(--text-dim)]"
            >
              <h2 className="text-base font-semibold text-[var(--text-main)]">{feature}</h2>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
