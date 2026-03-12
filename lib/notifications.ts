const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY ?? "";

// Neynar API: POST /v2/farcaster/frame/notifications/
const NEYNAR_NOTIFY_URL =
  "https://api.neynar.com/v2/farcaster/frame/notifications/";

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
    const response = await fetch(NEYNAR_NOTIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        notification: {
          title: title.slice(0, 32),
          body: body.slice(0, 128),
          target_url: targetUrl ?? appUrl,
        },
        target_fids: [fid],
      }),
    });

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
    const response = await fetch(NEYNAR_NOTIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        notification: {
          title: title.slice(0, 32),
          body: body.slice(0, 128),
          target_url: targetUrl ?? appUrl,
        },
        target_fids: [],
      }),
    });

    if (response.ok) return { state: "success" };
    const errorData = await response.json().catch(() => ({}));
    return { state: "error", error: errorData };
  } catch (error) {
    return { state: "error", error };
  }
}
