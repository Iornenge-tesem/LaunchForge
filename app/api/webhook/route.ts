import { NextResponse } from "next/server";

/**
 * POST /api/webhook
 *
 * Farcaster webhook handler. Notification tokens are now managed by Neynar's
 * hosted webhook (configured in the Farcaster manifest). This endpoint is
 * kept as a fallback and returns ok.
 */
export async function POST() {
  return NextResponse.json({ ok: true });
}
