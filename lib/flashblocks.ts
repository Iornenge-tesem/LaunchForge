export type FlashblocksTxStatus = "Known" | "Unknown";

const DEFAULT_FLASHBLOCKS_RPC = "https://mainnet-preconf.base.org";

export function getFlashblocksRpcUrl(): string {
  return process.env.FLASHBLOCKS_RPC_URL || DEFAULT_FLASHBLOCKS_RPC;
}

export async function getFlashblocksTransactionStatus(
  txHash: string
): Promise<FlashblocksTxStatus> {
  const rpcUrl = getFlashblocksRpcUrl();

  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "base_transactionStatus",
      params: [txHash],
      id: 1,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Flashblocks RPC error: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: string;
    error?: { message?: string };
  };

  if (data.error) {
    throw new Error(data.error.message || "Flashblocks status lookup failed");
  }

  return data.result === "Known" ? "Known" : "Unknown";
}
