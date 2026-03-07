import { NextRequest, NextResponse } from "next/server";
import { incrementLikes } from "@/lib/db/projects";
import { recordLike } from "@/lib/db/users";

type Params = { params: Promise<{ id: string }> };

/** POST /api/projects/:id/like — like a project (one per wallet) */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Try to parse wallet from body for dedup
    let wallet: string | undefined;
    try {
      const body = await request.json();
      wallet = body.wallet;
    } catch {
      // no body — fall through to legacy path
    }

    if (wallet && typeof wallet === "string") {
      const added = await recordLike(id, wallet);
      if (!added) {
        return NextResponse.json(
          { ok: false, error: "Already liked" },
          { status: 409 }
        );
      }
    } else {
      // Legacy path: no wallet provided, just increment
      await incrementLikes(id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
