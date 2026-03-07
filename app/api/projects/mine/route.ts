import { NextRequest, NextResponse } from "next/server";
import { getProjectsByCreator } from "@/lib/db/projects";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");

  if (!wallet || wallet.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid wallet address" },
      { status: 400 }
    );
  }

  try {
    const projects = await getProjectsByCreator(wallet);
    return NextResponse.json({ ok: true, projects });
  } catch (err) {
    console.error("GET /api/projects/mine", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
