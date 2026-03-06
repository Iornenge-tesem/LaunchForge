import { NextRequest, NextResponse } from "next/server";
import { incrementLikes } from "@/lib/db/projects";

type Params = { params: Promise<{ id: string }> };

/** POST /api/projects/:id/like — increment like count */
export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await incrementLikes(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
