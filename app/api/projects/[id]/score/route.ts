import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProjectScore } from "@/lib/db/projects";
import { scoreProject } from "@/lib/ai/scoreProject";
import type { CreateProjectInput } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

/** POST /api/projects/:id/score — re-run AI scoring for a project */
export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const input: CreateProjectInput = {
      name: project.name,
      description: project.description,
      tokenSymbol: project.tokenSymbol || undefined,
      category: project.category,
      website: project.website || undefined,
      twitter: project.twitter || undefined,
      github: project.github,
      fundingTarget: project.fundingTarget,
    };

    const result = await scoreProject(input, project.creator);
    await updateProjectScore(id, result.score, result.riskFlags);

    return NextResponse.json({
      ok: true,
      score: result.score,
      breakdown: result.breakdown,
      riskFlags: result.riskFlags,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
