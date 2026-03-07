import { NextRequest, NextResponse } from "next/server";
import { upsertUser } from "@/lib/db/users";

/** POST /api/users/save — save or update user profile on wallet connect */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, fid, username, displayName, pfpUrl } = body;

    if (!wallet || typeof wallet !== "string") {
      return NextResponse.json(
        { ok: false, error: "wallet is required" },
        { status: 400 }
      );
    }

    await upsertUser({ wallet, fid, username, displayName, pfpUrl });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
