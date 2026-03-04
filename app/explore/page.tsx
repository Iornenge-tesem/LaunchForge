"use client";

import { useState } from "react";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { mockProjects } from "@/lib/projects";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { ProjectStatus, ProjectCategory } from "@/lib/types";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

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
  const [showCategories, setShowCategories] = useState(false);

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
        <div className="mx-auto w-full max-w-[1200px] px-5 py-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative mb-4">
            <span className="pointer-events-none absolute left-0 top-0 flex h-[44px] w-11 items-center justify-center text-[var(--text-dim)]">
              <Search size={17} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="h-[44px] w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-input)] pl-12 pr-4 text-sm text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] sm:max-w-sm"
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
                  className={`cursor-pointer rounded-full border px-6 py-3 text-sm font-medium transition-all duration-150 ${
                    statusFilter === f.value
                      ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] shadow-[var(--shadow-xs)]"
                      : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowCategories((prev) => !prev)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
            >
              <SlidersHorizontal size={16} />
              Filter Categories
              {showCategories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showCategories && (
            <div className="mt-6 flex flex-wrap gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-3">
              {categoryFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCategoryFilter(f.value)}
                  className={`cursor-pointer rounded-[10px] border px-7 py-3.5 text-sm font-medium transition-all duration-150 ${
                    categoryFilter === f.value
                      ? "border-[var(--purple)] bg-[var(--purple-muted)] text-[var(--purple)] shadow-[var(--shadow-xs)]"
                      : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] p-16 text-center shadow-[var(--shadow-sm)]">
            <p className="text-base text-[var(--text-dim)]">
              No projects match your filters.
            </p>
            <button
              onClick={() => {
                setStatusFilter("All");
                setCategoryFilter("all");
                setSearch("");
              }}
              className="mt-3 cursor-pointer text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </Section>
    </>
  );
}
