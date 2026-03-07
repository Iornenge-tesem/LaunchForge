import { NextRequest, NextResponse } from "next/server";
import { updateProjectToken, recordLaunchTransaction } from "@/lib/db/projects";

/** POST /api/projects/:id/token — save token deployment info */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tokenAddress, txHash, tokenName, tokenSymbol, tokenSupply, wallet } = body;

    if (!tokenAddress || typeof tokenAddress !== "string") {
      return NextResponse.json(
        { ok: false, error: "tokenAddress is required" },
        { status: 400 }
      );
    }
    if (!txHash || typeof txHash !== "string") {
      return NextResponse.json(
        { ok: false, error: "txHash is required" },
        { status: 400 }
      );
    }
    if (!wallet || typeof wallet !== "string") {
      return NextResponse.json(
        { ok: false, error: "wallet is required" },
        { status: 400 }
      );
    }

    // Update project with token info + set status to Live
    await updateProjectToken(id, tokenAddress, txHash, tokenSupply ?? 0);

    // Record the launch transaction
    await recordLaunchTransaction({
      walletAddress: wallet,
      projectId: id,
      txHash,
      amountPaid: 0.4,
      tokenAddress,
      tokenName: tokenName ?? "",
      tokenSymbol: tokenSymbol ?? "",
      tokenSupply: tokenSupply ?? 0,
      status: "confirmed",
    });

    return NextResponse.json({ ok: true, tokenAddress });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
