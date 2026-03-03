import { NextRequest, NextResponse } from "next/server";
import { mockProjects } from "@/lib/projects";

/** GET /api/projects — list all projects */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("q");

  let projects = [...mockProjects];

  if (status) {
    projects = projects.filter(
      (p) => p.status.toLowerCase() === status.toLowerCase()
    );
  }
  if (category) {
    projects = projects.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    ok: true,
    count: projects.length,
    projects,
  });
}
