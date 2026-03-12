import { NextRequest, NextResponse } from "next/server";
import { listProjects } from "@/lib/db/projects";
import { createGetAgent } from "fishnet-auth/nextjs";
import { SupabaseAdapter } from "fishnet-auth/adapters/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getAgent = createGetAgent({
  secret: process.env.FISHNET_AUTH_SECRET!,
  adapter: SupabaseAdapter(supabase as any),
});

/**
 * GET /api/analytics
 *
 * Public: returns summary metrics.
 * Authenticated agents (via Fishnet): receive full analytics including top projects.
 *
 * Agents must authenticate at POST /api/agent-auth first.
 */
export async function GET(request: NextRequest) {
  const agent = await getAgent(request).catch(() => null);

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

    const summary = {
      totalProjects: total,
      liveProjects: live,
      totalViews,
      totalLikes,
      totalFunding,
    };

    if (!agent) {
      return NextResponse.json({
        ok: true,
        analytics: summary,
        agentAuth: {
          hint: "Authenticate via Fishnet to access full analytics including top projects.",
          endpoint: "/api/agent-auth",
        },
      });
    }

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
      agent: { id: agent.id, name: agent.name },
      analytics: { ...summary, topProjects },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
