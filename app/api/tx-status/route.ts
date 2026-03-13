import { NextResponse } from "next/server";
import { getFlashblocksTransactionStatus } from "@/lib/flashblocks";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash");

  if (!hash || !/^0x[a-fA-F0-9]{64}$/.test(hash)) {
    return NextResponse.json(
      { ok: false, error: "Invalid transaction hash" },
      { status: 400 }
    );
  }

  try {
    const status = await getFlashblocksTransactionStatus(hash);
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 502 }
    );
  }
}
