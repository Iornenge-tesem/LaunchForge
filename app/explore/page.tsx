import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { mockProjects } from "@/lib/projects";

export default function ExplorePage() {
  return (
    <Section>
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--text-main)]">Explore Projects</h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">Browse launched projects from serious builders.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            description={project.description}
            creator={project.creator}
            status={project.status}
          />
        ))}
      </div>
    </Section>
  );
}
