import { NextRequest, NextResponse } from "next/server";
// TODO: import x402 middleware once installed
// import { verifyPayment } from "@/lib/x402";

/**
 * POST /api/projects/create
 *
 * Creates a new project listing. In production, this endpoint is gated
 * by x402 micro-payment ($0.01 USDC on Base).
 *
 * Request body:
 * {
 *   name: string;
 *   description: string;
 *   tokenSymbol?: string;
 *   category: string;
 *   website?: string;
 *   twitter?: string;
 *   github?: string;
 *   fundingTarget?: number;
 * }
 *
 * Headers:
 *   X-PAYMENT: EIP-712 signed USDC payment (x402)
 */
export async function POST(request: NextRequest) {
  try {
    // ── x402 Payment Verification ──────────────────────────
    // const paymentHeader = request.headers.get("X-PAYMENT");
    // if (!paymentHeader) {
    //   return NextResponse.json(
    //     { ok: false, error: "Payment required", amount: "$0.01 USDC" },
    //     { status: 402 }
    //   );
    // }
    // const paymentValid = await verifyPayment(paymentHeader);
    // if (!paymentValid) {
    //   return NextResponse.json(
    //     { ok: false, error: "Invalid payment" },
    //     { status: 402 }
    //   );
    // }

    const body = await request.json();

    // ── Validation ─────────────────────────────────────────
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

    // ── Create project (placeholder — swap with DB in production) ──
    const newProject = {
      id: body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      name: body.name.trim(),
      description: body.description.trim(),
      tokenSymbol: body.tokenSymbol?.trim() ?? "",
      category: body.category ?? "other",
      website: body.website?.trim() ?? "",
      twitter: body.twitter?.trim() ?? "",
      github: body.github?.trim() ?? "",
      creator: "0x0000...0000", // TODO: extract from wallet signature
      status: "Draft" as const,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      fundingTarget: body.fundingTarget ?? 0,
      fundingRaised: 0,
    };

    // TODO: save to database
    // TODO: trigger AI scoring agent

    return NextResponse.json(
      { ok: true, project: newProject },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
