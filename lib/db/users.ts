import { getSupabase } from "@/lib/db/supabase";

export type UserProfile = {
  wallet: string;
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

/** Upsert a user profile — insert on first connect, update on subsequent visits. */
export async function upsertUser(profile: UserProfile): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("users").upsert(
    {
      wallet: profile.wallet.toLowerCase(),
      fid: profile.fid ?? null,
      username: profile.username ?? null,
      display_name: profile.displayName ?? null,
      pfp_url: profile.pfpUrl ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "wallet" }
  );
  if (error) throw new Error(error.message);
}

/** Check if a wallet has liked a specific project. */
export async function hasLiked(
  projectId: string,
  wallet: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("project_likes")
    .select("id")
    .eq("project_id", projectId)
    .eq("wallet", wallet.toLowerCase())
    .maybeSingle();
  return !!data;
}

/** Record a like (insert into project_likes + increment counter). Returns false if already liked. */
export async function recordLike(
  projectId: string,
  wallet: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("project_likes").insert({
    project_id: projectId,
    wallet: wallet.toLowerCase(),
  });

  if (error) {
    // unique constraint violation means already liked
    if (error.code === "23505") return false;
    throw new Error(error.message);
  }

  // Increment the counter on the projects table
  await supabase.rpc("increment_likes", { project_id: projectId });
  return true;
}
