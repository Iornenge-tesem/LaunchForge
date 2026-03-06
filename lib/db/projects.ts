import { getSupabase } from "@/lib/db/supabase";
import type { LaunchProject, CreateProjectInput, ProjectStatus } from "@/lib/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function generateId(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) +
    "-" +
    Date.now().toString(36)
  );
}

/** Map a raw Supabase row to a typed LaunchProject */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProject(row: any): LaunchProject {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    creator: row.creator_wallet,
    status: (row.status as ProjectStatus) ?? "Draft",
    tokenSymbol: row.token_symbol ?? "",
    category: row.category,
    website: row.website ?? "",
    twitter: row.twitter ?? "",
    github: row.github ?? undefined,
    aiScore: row.ai_score ?? undefined,
    riskFlags: row.risk_flags ?? [],
    likes: row.likes ?? 0,
    views: row.views ?? 0,
    createdAt: row.created_at,
    logoUrl: row.logo_url ?? undefined,
    fundingTarget: row.funding_target ?? undefined,
    fundingRaised: row.funding_raised ?? 0,
  };
}

// ── queries ───────────────────────────────────────────────────────────────────

export async function listProjects(opts?: {
  status?: string;
  category?: string;
  search?: string;
}): Promise<LaunchProject[]> {
  const supabase = getSupabase();
  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (opts?.status) {
    query = query.ilike("status", opts.status);
  }
  if (opts?.category) {
    query = query.ilike("category", opts.category);
  }
  if (opts?.search) {
    query = query.or(
      `name.ilike.%${opts.search}%,description.ilike.%${opts.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProject);
}

export async function getProjectById(id: string): Promise<LaunchProject | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(error.message);
  }
  return rowToProject(data);
}

export async function createProject(
  input: CreateProjectInput,
  creatorWallet: string
): Promise<LaunchProject> {
  const id = generateId(input.name);

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      id,
      name: input.name.trim(),
      description: input.description.trim(),
      token_symbol: input.tokenSymbol?.trim() ?? null,
      category: input.category,
      website: input.website?.trim() ?? null,
      twitter: input.twitter?.trim() ?? null,
      github: input.github?.trim() ?? null,
      funding_target: input.fundingTarget ?? null,
      funding_raised: 0,
      creator_wallet: creatorWallet,
      status: "Draft",
      likes: 0,
      views: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToProject(data);
}

export async function incrementViews(id: string): Promise<void> {
  await getSupabase().rpc("increment_views", { project_id: id });
}

export async function incrementLikes(id: string): Promise<void> {
  await getSupabase().rpc("increment_likes", { project_id: id });
}
