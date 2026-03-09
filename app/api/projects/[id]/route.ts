import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/lib/db/projects";

type Params = { params: Promise<{ id: string }> };

/** GET /api/projects/:id — get project details from Supabase */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
