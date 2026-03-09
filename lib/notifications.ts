import { getNotificationDetails, getAllNotificationTokens } from "@/lib/db/notifications";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

type SendResult =
  | { state: "success" }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "error"; error: unknown };

/** Send a notification to a specific user (by FID + appFid). */
export async function sendNotification({
  fid,
  appFid,
  title,
  body,
  targetUrl,
}: {
  fid: number;
  appFid: number;
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<SendResult> {
  const details = await getNotificationDetails(fid, appFid);
  if (!details) return { state: "no_token" };

  return sendToToken({
    token: details.token,
    url: details.url,
    title,
    body,
    targetUrl: targetUrl ?? appUrl,
  });
}

/** Send a notification directly to a token/url pair. */
async function sendToToken({
  token,
  url,
  title,
  body,
  targetUrl,
}: {
  token: string;
  url: string;
  title: string;
  body: string;
  targetUrl: string;
}): Promise<SendResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: crypto.randomUUID(),
        title: title.slice(0, 32),
        body: body.slice(0, 128),
        targetUrl: targetUrl.slice(0, 1024),
        tokens: [token],
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data?.result?.rateLimitedTokens?.length) {
        return { state: "rate_limit" };
      }
      return { state: "success" };
    }

    const errorData = await response.json().catch(() => ({}));
    return { state: "error", error: errorData };
  } catch (error) {
    return { state: "error", error };
  }
}

/** Broadcast a notification to all registered users. */
export async function broadcastNotification({
  title,
  body,
  targetUrl,
}: {
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<{ sent: number; failed: number }> {
  const tokens = await getAllNotificationTokens();
  let sent = 0;
  let failed = 0;

  for (const t of tokens) {
    const result = await sendToToken({
      token: t.token,
      url: t.url,
      title,
      body,
      targetUrl: targetUrl ?? appUrl,
    });
    if (result.state === "success") sent++;
    else failed++;
  }

  return { sent, failed };
}
