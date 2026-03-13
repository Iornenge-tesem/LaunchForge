import { NextRequest, NextResponse } from "next/server";
import { upsertNotificationToken } from "@/lib/db/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fid = Number(body.fid);
    const appFid = Number(process.env.FARCASTER_APP_FID ?? body.appFid);
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!Number.isFinite(fid) || fid <= 0) {
      return NextResponse.json(
        { ok: false, error: "fid is required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(appFid) || appFid <= 0) {
      return NextResponse.json(
        { ok: false, error: "appFid is required" },
        { status: 400 }
      );
    }

    if (!token || !url) {
      return NextResponse.json(
        { ok: false, error: "token and url are required" },
        { status: 400 }
      );
    }

    await upsertNotificationToken({ fid, appFid, token, url });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
