import { NextResponse } from "next/server";
import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";
import {
  setNotificationDetails,
  deleteNotificationDetails,
} from "@/lib/db/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await parseWebhookEvent(body, verifyAppKeyWithNeynar);

    const { fid, appFid, event } = result;

    switch (event.event) {
      case "miniapp_added":
      case "notifications_enabled":
        if (event.notificationDetails) {
          await setNotificationDetails(fid, appFid, {
            token: event.notificationDetails.token,
            url: event.notificationDetails.url,
          });
        }
        break;

      case "miniapp_removed":
      case "notifications_disabled":
        await deleteNotificationDetails(fid, appFid);
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
