import { NextRequest, NextResponse } from "next/server";
import { findProjectById } from "@/lib/projects";

type Params = { params: Promise<{ id: string }> };

/** GET /api/projects/:id — get project details */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const project = findProjectById(id);

  if (!project) {
    return NextResponse.json(
      { ok: false, error: "Project not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, project });
}
