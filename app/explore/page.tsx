"use client";

import { useState } from "react";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { mockProjects } from "@/lib/projects";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { ProjectStatus, ProjectCategory } from "@/lib/types";

const statusFilters: { label: string; value: ProjectStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Live", value: "Live" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Draft", value: "Draft" },
];

const categoryFilters: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "All", value: "all" },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value: value as ProjectCategory,
  })),
];

export default function ExplorePage() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = mockProjects.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Section>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
          Explore Projects
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-dim)]">
          Browse {mockProjects.length} projects from serious builders on Base.
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects…"
          className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none transition-colors placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] sm:max-w-xs"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Status */}
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category */}
        <div className="flex flex-wrap gap-1.5">
          {categoryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setCategoryFilter(f.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === f.value
                  ? "border-[var(--purple)] bg-[var(--purple-muted)] text-[var(--purple)]"
                  : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center">
          <p className="text-sm text-[var(--text-dim)]">
            No projects match your filters.
          </p>
        </div>
      )}
    </Section>
  );
}
