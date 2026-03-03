import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { findProjectById } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = findProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <Section>
      <div className="mx-auto max-w-3xl rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[var(--bg-soft)] p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--text-main)]">{project.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-dim)]">{project.description}</p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-dim)]">Creator</dt>
            <dd className="mt-1 text-sm text-[var(--text-main)]">{project.creator}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-dim)]">Token Symbol</dt>
            <dd className="mt-1 text-sm text-[var(--text-main)]">{project.tokenSymbol}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-dim)]">Website</dt>
            <dd className="mt-1 text-sm text-[var(--forge-electric)]">{project.website}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-dim)]">Twitter</dt>
            <dd className="mt-1 text-sm text-[var(--forge-electric)]">{project.twitter}</dd>
          </div>
        </dl>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(7,11,20,0.75)] p-4">
            <h2 className="text-sm font-semibold text-[var(--text-main)]">Ratings</h2>
            <p className="mt-2 text-sm text-[var(--text-dim)]">Ratings placeholder.</p>
          </div>
          <div className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(7,11,20,0.75)] p-4">
            <h2 className="text-sm font-semibold text-[var(--text-main)]">AI Analysis</h2>
            <p className="mt-2 text-sm text-[var(--text-dim)]">AI analysis placeholder.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
