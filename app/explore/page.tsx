"use client";

import { useState, useEffect, useCallback } from "react";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { LaunchProject, ProjectStatus, ProjectCategory } from "@/lib/types";
import { SlidersHorizontal, ChevronDown, ChevronUp, Search } from "lucide-react";

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
  const [projects, setProjects] = useState<LaunchProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "All") params.set("status", statusFilter);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (search.trim()) params.set("q", search.trim());

    try {
      const res = await fetch(`/api/projects?${params.toString()}`);
      const json = await res.json();
      if (json.ok) setProjects(json.projects);
    } catch {
      // network error — keep previous results
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timeout);
  }, [fetchProjects]);

  return (
    <>
      {/* Sticky search & filters */}
      <div className="sticky top-16 z-40 border-b border-[var(--border)] bg-[var(--bg-overlay)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
                className="h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 pl-11 text-sm text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus-visible:outline-none sm:max-w-sm"
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
                  className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition-all duration-150 ${
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
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-5 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
            >
              <SlidersHorizontal size={16} />
              Filter Categories
              {showCategories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showCategories && (
            <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-3">
              {categoryFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCategoryFilter(f.value)}
                  className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition-all duration-150 ${
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
            Browse projects from serious builders on Base.
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 shimmer rounded-lg" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 shimmer rounded-full" />
                      <div className="h-6 w-14 shimmer rounded-full" />
                    </div>
                  </div>
                  <div className="h-8 w-8 shimmer rounded-full" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full shimmer rounded-md" />
                  <div className="h-4 w-5/6 shimmer rounded-md" />
                </div>
                <div className="mt-5 h-2 w-full shimmer rounded-full" />
                <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <div className="h-4 w-24 shimmer rounded-md" />
                  <div className="flex gap-3">
                    <div className="h-4 w-10 shimmer rounded-md" />
                    <div className="h-4 w-10 shimmer rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-16 text-center shadow-[var(--shadow-sm)]">
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
