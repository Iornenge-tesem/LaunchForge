import { NextRequest, NextResponse } from "next/server";
import { listProjects } from "@/lib/db/projects";
import type { SortOption } from "@/lib/db/projects";

/** GET /api/projects — list projects from Supabase */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projects = await listProjects({
      status: searchParams.get("status") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      search: searchParams.get("q") ?? undefined,
      sort: (searchParams.get("sort") as SortOption) ?? undefined,
      minFunding: searchParams.get("minFunding")
        ? Number(searchParams.get("minFunding"))
        : undefined,
      maxFunding: searchParams.get("maxFunding")
        ? Number(searchParams.get("maxFunding"))
        : undefined,
    });

    return NextResponse.json({ ok: true, count: projects.length, projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
