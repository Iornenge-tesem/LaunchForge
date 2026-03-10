import { NextRequest, NextResponse } from "next/server";
import { createProject, updateProjectScore } from "@/lib/db/projects";
import { scoreProject } from "@/lib/ai/scoreProject";
import { broadcastNotification } from "@/lib/notifications";
import type { CreateProjectInput } from "@/lib/types";

/**
 * POST /api/projects/create
 *
 * Creates a new project listing saved to Supabase.
 * Free to create — real payment happens at token deployment (0.1 USDC on-chain).
 *
 * Body: { name, description, tokenSymbol?, category, website?,
 *         twitter?, github?, fundingTarget?, creatorWallet }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Input validation ───────────────────────────────────
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: "Project name is required (min 2 characters)" },
        { status: 400 }
      );
    }
    if (
      !body.description ||
      typeof body.description !== "string" ||
      body.description.trim().length < 10
    ) {
      return NextResponse.json(
        { ok: false, error: "Description is required (min 10 characters)" },
        { status: 400 }
      );
    }
    if (!body.creatorWallet || typeof body.creatorWallet !== "string") {
      return NextResponse.json(
        { ok: false, error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const input: CreateProjectInput = {
      name: body.name,
      description: body.description,
      tokenSymbol: body.tokenSymbol,
      category: body.category ?? "other",
      website: body.website,
      twitter: body.twitter,
      github: body.github,
      fundingTarget: body.fundingTarget ? Number(body.fundingTarget) : undefined,
      creatorUsername: body.creatorUsername,
      creatorDisplayName: body.creatorDisplayName,
      creatorPfpUrl: body.creatorPfpUrl,
    };

    const project = await createProject(input, body.creatorWallet);

    // Run AI scoring in the background (don't block the response)
    scoreProject(input, body.creatorWallet)
      .then(async (result) => {
        await updateProjectScore(project.id, result.score, result.riskFlags);
      })
      .catch(() => {});

    // Notify all users about new project (fire-and-forget)
    broadcastNotification({
      title: "New Project Launched",
      body: `${input.name} just launched on LaunchForge!`,
      targetUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app"}/project/${project.id}`,
    }).catch(() => {});

    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
