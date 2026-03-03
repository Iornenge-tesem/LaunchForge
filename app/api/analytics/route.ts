import { NextRequest, NextResponse } from "next/server";
import { mockProjects } from "@/lib/projects";

/**
 * GET /api/analytics
 *
 * Returns platform-wide analytics data.
 * In production, this endpoint is gated by x402 ($0.001 USDC).
 */
export async function GET(_request: NextRequest) {
  // TODO: x402 payment gate for premium analytics

  const total = mockProjects.length;
  const live = mockProjects.filter((p) => p.status === "Live").length;
  const totalViews = mockProjects.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = mockProjects.reduce((sum, p) => sum + p.likes, 0);
  const totalFunding = mockProjects.reduce(
    (sum, p) => sum + (p.fundingRaised ?? 0),
    0
  );

  const topProjects = [...mockProjects]
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
}
