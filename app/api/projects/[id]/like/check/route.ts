import { NextRequest, NextResponse } from "next/server";
import { hasLiked } from "@/lib/db/users";

type Params = { params: Promise<{ id: string }> };

/** GET /api/projects/:id/like/check?wallet=0x... — check if wallet already liked */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const wallet = request.nextUrl.searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json({ liked: false });
    }

    const liked = await hasLiked(id, wallet);
    return NextResponse.json({ liked });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ liked: false, error: message }, { status: 500 });
  }
}
