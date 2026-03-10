const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY ?? "";
const NEYNAR_MINI_APP_ID = "7053ce87-5037-498c-a08d-b91a5f0c9ae2";

type SendResult =
  | { state: "success" }
  | { state: "no_token" }
  | { state: "error"; error: unknown };

/** Send a notification to a specific user (by FID) via Neynar. */
export async function sendNotification({
  fid,
  title,
  body,
  targetUrl,
}: {
  fid: number;
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<SendResult> {
  if (!NEYNAR_API_KEY) return { state: "error", error: "NEYNAR_API_KEY not set" };

  try {
    const response = await fetch(
      "https://api.neynar.com/v2/farcaster/miniapp/notification/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": NEYNAR_API_KEY,
        },
        body: JSON.stringify({
          app_id: NEYNAR_MINI_APP_ID,
          target_fids: [fid],
          title: title.slice(0, 32),
          body: body.slice(0, 128),
          target_url: targetUrl ?? appUrl,
        }),
      }
    );

    if (response.ok) return { state: "success" };
    const errorData = await response.json().catch(() => ({}));
    return { state: "error", error: errorData };
  } catch (error) {
    return { state: "error", error };
  }
}

/** Broadcast a notification to all mini app users via Neynar. */
export async function broadcastNotification({
  title,
  body,
  targetUrl,
}: {
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<{ state: "success" | "error"; error?: unknown }> {
  if (!NEYNAR_API_KEY) return { state: "error", error: "NEYNAR_API_KEY not set" };

  try {
    const response = await fetch(
      "https://api.neynar.com/v2/farcaster/miniapp/notification/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": NEYNAR_API_KEY,
        },
        body: JSON.stringify({
          app_id: NEYNAR_MINI_APP_ID,
          title: title.slice(0, 32),
          body: body.slice(0, 128),
          target_url: targetUrl ?? appUrl,
        }),
      }
    );

    if (response.ok) return { state: "success" };
    const errorData = await response.json().catch(() => ({}));
    return { state: "error", error: errorData };
  } catch (error) {
    return { state: "error", error };
  }
}
