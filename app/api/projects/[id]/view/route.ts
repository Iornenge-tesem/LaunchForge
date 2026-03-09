import { NextRequest, NextResponse } from "next/server";
import { recordView } from "@/lib/db/users";

type Params = { params: Promise<{ id: string }> };

/** POST /api/projects/:id/view — record a unique view (one per wallet) */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    let wallet: string | undefined;
    try {
      const body = await request.json();
      wallet = body.wallet;
    } catch {
      // no body
    }

    if (!wallet || typeof wallet !== "string") {
      return NextResponse.json(
        { ok: false, error: "wallet is required" },
        { status: 400 }
      );
    }

    const added = await recordView(id, wallet);
    return NextResponse.json({ ok: true, newView: added });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
