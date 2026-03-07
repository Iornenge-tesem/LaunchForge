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
    creatorUsername: row.creator_username ?? undefined,
    creatorDisplayName: row.creator_display_name ?? undefined,
    creatorPfpUrl: row.creator_pfp_url ?? undefined,
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

export type SortOption = "newest" | "oldest" | "most_funded" | "most_liked" | "most_viewed" | "highest_score";

export async function listProjects(opts?: {
  status?: string;
  category?: string;
  search?: string;
  sort?: SortOption;
  minFunding?: number;
  maxFunding?: number;
}): Promise<LaunchProject[]> {
  const supabase = getSupabase();
  let query = supabase.from("projects").select("*");

  // Sorting
  const sort = opts?.sort ?? "newest";
  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "most_funded":
      query = query.order("funding_raised", { ascending: false });
      break;
    case "most_liked":
      query = query.order("likes", { ascending: false });
      break;
    case "most_viewed":
      query = query.order("views", { ascending: false });
      break;
    case "highest_score":
      query = query.order("ai_score", { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

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
  if (opts?.minFunding !== undefined) {
    query = query.gte("funding_target", opts.minFunding);
  }
  if (opts?.maxFunding !== undefined) {
    query = query.lte("funding_target", opts.maxFunding);
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
      creator_username: input.creatorUsername ?? null,
      creator_display_name: input.creatorDisplayName ?? null,
      creator_pfp_url: input.creatorPfpUrl ?? null,
      status: "Draft",
      likes: 0,
      views: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToProject(data);
}

export async function updateProjectScore(
  id: string,
  score: number,
  riskFlags: string[]
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("projects")
    .update({ ai_score: score, risk_flags: riskFlags })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function incrementViews(id: string): Promise<void> {
  await getSupabase().rpc("increment_views", { project_id: id });
}

export async function incrementLikes(id: string): Promise<void> {
  await getSupabase().rpc("increment_likes", { project_id: id });
}

export async function getProjectsByCreator(
  wallet: string
): Promise<LaunchProject[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("creator_wallet", wallet)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProject);
}
