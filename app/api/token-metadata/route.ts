import { NextRequest, NextResponse } from "next/server";
import { fetchTokenProjectMetadata } from "@/lib/tokenMetadata";

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address")?.trim();

    if (!address) {
      return NextResponse.json(
        { ok: false, error: "address is required" },
        { status: 400 }
      );
    }

    const metadata = await fetchTokenProjectMetadata(address);
    return NextResponse.json({ ok: true, metadata });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
