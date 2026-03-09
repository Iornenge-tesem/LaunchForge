import { NextRequest, NextResponse } from "next/server";
import { listProjects } from "@/lib/db/projects";

/**
 * GET /api/analytics
 *
 * Returns platform-wide analytics data from the live database.
 */
export async function GET(_request: NextRequest) {
  try {
    const projects = await listProjects();

    const total = projects.length;
    const live = projects.filter((p) => p.status === "Live").length;
    const totalViews = projects.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = projects.reduce((sum, p) => sum + p.likes, 0);
    const totalFunding = projects.reduce(
      (sum, p) => sum + (p.fundingRaised ?? 0),
      0
    );

    const topProjects = [...projects]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        views: p.views,
        likes: p.likes,
        aiScore: p.aiScore,
      }));

    return NextResponse.json({
      ok: true,
      analytics: {
        totalProjects: total,
        liveProjects: live,
        totalViews,
        totalLikes,
        totalFunding,
        topProjects,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
