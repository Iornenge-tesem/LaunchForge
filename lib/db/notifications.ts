import { getSupabase } from "@/lib/db/supabase";

export type NotificationToken = {
  fid: number;
  appFid: number;
  token: string;
  url: string;
};

/** Save or update a notification token for a user+client combination. */
export async function setNotificationDetails(
  fid: number,
  appFid: number,
  details: { token: string; url: string }
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("notification_tokens").upsert(
    {
      fid,
      app_fid: appFid,
      token: details.token,
      url: details.url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "fid,app_fid" }
  );
  if (error) throw new Error(error.message);
}

/** Delete notification details when a user disables notifications or removes the app. */
export async function deleteNotificationDetails(
  fid: number,
  appFid: number
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("notification_tokens")
    .delete()
    .eq("fid", fid)
    .eq("app_fid", appFid);
  if (error) throw new Error(error.message);
}

/** Get notification details for a specific user+client. */
export async function getNotificationDetails(
  fid: number,
  appFid: number
): Promise<NotificationToken | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("notification_tokens")
    .select("*")
    .eq("fid", fid)
    .eq("app_fid", appFid)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    fid: data.fid,
    appFid: data.app_fid,
    token: data.token,
    url: data.url,
  };
}

/** Get all notification tokens (for broadcast notifications). */
export async function getAllNotificationTokens(): Promise<NotificationToken[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("notification_tokens")
    .select("*");

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    fid: row.fid,
    appFid: row.app_fid,
    token: row.token,
    url: row.url,
  }));
}
