"use client";

import { useState } from "react";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { mockProjects } from "@/lib/projects";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { ProjectStatus, ProjectCategory } from "@/lib/types";
import { Search } from "lucide-react";

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
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">(
    "All"
  );
  const [categoryFilter, setCategoryFilter] = useState<
    ProjectCategory | "all"
  >("all");
  const [search, setSearch] = useState("");

  const filtered = mockProjects.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <>
      {/* Sticky search & filters */}
      <div className="sticky top-16 z-40 border-b border-[var(--border)] bg-[var(--bg-overlay)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:px-8">
          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-11 pr-4 text-sm text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] sm:max-w-sm"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* Status */}
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    statusFilter === f.value
                      ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] shadow-[var(--shadow-xs)]"
                      : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="hidden h-5 w-px bg-[var(--border)] sm:block" />

            {/* Category */}
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCategoryFilter(f.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    categoryFilter === f.value
                      ? "border-[var(--purple)] bg-[var(--purple-muted)] text-[var(--purple)] shadow-[var(--shadow-xs)]"
                      : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Section>
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Explore Projects
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
            Browse {mockProjects.length} projects from serious builders on Base.
          </p>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-16 text-center shadow-[var(--shadow-sm)]">
            <p className="text-base text-[var(--text-dim)]">
              No projects match your filters.
            </p>
            <button
              onClick={() => {
                setStatusFilter("All");
                setCategoryFilter("all");
                setSearch("");
              }}
              className="mt-3 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </Section>
    </>
  );
}
