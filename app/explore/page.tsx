"use client";

import { useState, useEffect, useCallback } from "react";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { LaunchProject, ProjectStatus, ProjectCategory } from "@/lib/types";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  X,
} from "lucide-react";

type SortOption = "newest" | "oldest" | "most_funded" | "most_liked" | "most_viewed" | "highest_score";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Funded", value: "most_funded" },
  { label: "Most Liked", value: "most_liked" },
  { label: "Most Viewed", value: "most_viewed" },
  { label: "Top Rated", value: "highest_score" },
];

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

const fundingRanges = [
  { label: "Any", min: undefined, max: undefined },
  { label: "Under $1k", min: undefined, max: 1000 },
  { label: "$1k — $10k", min: 1000, max: 10000 },
  { label: "$10k — $50k", min: 10000, max: 50000 },
  { label: "$50k+", min: 50000, max: undefined },
];

export default function ExplorePage() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [fundingIdx, setFundingIdx] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [projects, setProjects] = useState<LaunchProject[]>([]);
  const [loading, setLoading] = useState(true);

  const activeFilterCount =
    (statusFilter !== "All" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (fundingIdx !== 0 ? 1 : 0);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "All") params.set("status", statusFilter);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (search.trim()) params.set("q", search.trim());
    if (sort !== "newest") params.set("sort", sort);
    const range = fundingRanges[fundingIdx];
    if (range.min !== undefined) params.set("minFunding", String(range.min));
    if (range.max !== undefined) params.set("maxFunding", String(range.max));

    try {
      const res = await fetch(`/api/projects?${params.toString()}`);
      const json = await res.json();
      if (json.ok) setProjects(json.projects);
    } catch {
      // network error — keep previous results
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search, sort, fundingIdx]);

  useEffect(() => {
    const timeout = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timeout);
  }, [fetchProjects]);

  function clearAll() {
    setStatusFilter("All");
    setCategoryFilter("all");
    setSearch("");
    setSort("newest");
    setFundingIdx(0);
  }

  return (
    <>
      {/* Sticky search & filters */}
      <div className="sticky top-16 z-40 border-b border-[var(--border)] bg-[var(--bg-overlay)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1200px] px-5 pb-2.5 pt-0 sm:px-6 lg:px-8">
          {/* Search + Sort row */}
          <div className="mb-2.5 flex items-center gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects…"
                className="h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 pr-11 text-sm text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent-border-soft)] focus-visible:outline-none"
              />
              <Search
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSort((prev) => !prev)}
                className="inline-flex h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
              >
                <ArrowUpDown size={14} />
                <span className="hidden sm:inline">
                  {sortOptions.find((s) => s.value === sort)?.label}
                </span>
                <ChevronDown size={14} />
              </button>
              {showSort && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSort(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-1.5 w-44 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5 shadow-[var(--shadow-lg)]">
                    {sortOptions.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => {
                          setSort(s.value);
                          setShowSort(false);
                        }}
                        className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                          sort === s.value
                            ? "bg-[var(--accent-muted)] font-medium text-[var(--accent)]"
                            : "text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filter chips row */}
          <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-3">
            {/* Status pills */}
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                    statusFilter === f.value
                      ? "border-[var(--accent-border-soft)] bg-[var(--accent-muted)] text-[var(--accent)] shadow-[var(--shadow-xs)]"
                      : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Advanced filters toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 1 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
              {showAdvanced ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>

            {/* Clear all */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
              >
                <X size={12} />
                Clear all
              </button>
            )}
          </div>

          {/* Advanced filter panel */}
          {showAdvanced && (
            <div className="mt-4 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              {/* Categories */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setCategoryFilter(f.value)}
                      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                        categoryFilter === f.value
                          ? "border-[var(--purple-border-soft)] bg-[var(--purple-muted)] text-[var(--purple)] shadow-[var(--shadow-xs)]"
                          : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding range */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  Funding Goal
                </p>
                <div className="flex flex-wrap gap-2">
                  {fundingRanges.map((r, i) => (
                    <button
                      key={r.label}
                      onClick={() => setFundingIdx(i)}
                      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                        fundingIdx === i
                          ? "border-[var(--green-border-soft)] bg-[var(--green-muted)] text-[var(--green)] shadow-[var(--shadow-xs)]"
                          : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Section>
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              Explore Projects
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
              Browse projects from serious builders on Base.
            </p>
          </div>
          {!loading && (
            <p className="text-sm text-[var(--text-dim)]">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              onClick={clearAll}
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
