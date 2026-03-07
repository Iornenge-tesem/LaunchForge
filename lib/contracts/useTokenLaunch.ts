"use client";

import { useState, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  FACTORY_ADDRESS,
  FACTORY_ABI,
  USDC_ADDRESS,
  USDC_ABI,
  LAUNCH_FEE,
  MAX_SUPPLY,
} from "@/lib/contracts/tokenFactory";
import { decodeEventLog } from "viem";

export type LaunchStep =
  | "idle"
  | "checking"
  | "approving"
  | "waiting-approval"
  | "creating"
  | "waiting-creation"
  | "saving"
  | "done"
  | "error";

export type LaunchResult = {
  tokenAddress: string;
  txHash: string;
};

export function useTokenLaunch() {
  const { address } = useAccount();
  const [step, setStep] = useState<LaunchStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchResult | null>(null);
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>();
  const [createTxHash, setCreateTxHash] = useState<`0x${string}` | undefined>();

  // Read USDC allowance for the factory
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "allowance",
    args: address && FACTORY_ADDRESS ? [address, FACTORY_ADDRESS] : undefined,
    query: { enabled: !!address && !!FACTORY_ADDRESS },
  });

  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContractAsync } = useWriteContract();

  // Wait for approval tx
  useWaitForTransactionReceipt({
    hash: approveTxHash,
    query: {
      enabled: !!approveTxHash,
    },
  });

  // Wait for create tx
  const { data: createReceipt } = useWaitForTransactionReceipt({
    hash: createTxHash,
    query: {
      enabled: !!createTxHash,
    },
  });

  const launch = useCallback(
    async (
      tokenName: string,
      tokenSymbol: string,
      totalSupply: number,
      onSave: (tokenAddress: string, txHash: string) => Promise<void>
    ) => {
      if (!address) {
        setError("Wallet not connected");
        setStep("error");
        return;
      }
      if (!FACTORY_ADDRESS) {
        setError("Factory contract not configured");
        setStep("error");
        return;
      }

      setError(null);
      setResult(null);
      setApproveTxHash(undefined);
      setCreateTxHash(undefined);

      try {
        // Validate inputs
        if (!tokenName.trim()) throw new Error("Token name is required");
        if (!tokenSymbol.trim()) throw new Error("Token symbol is required");
        if (totalSupply <= 0) throw new Error("Supply must be greater than 0");
        if (BigInt(totalSupply) > MAX_SUPPLY)
          throw new Error(`Supply cannot exceed ${MAX_SUPPLY.toLocaleString()}`);

        // Step 1: Check balance
        setStep("checking");
        if (usdcBalance !== undefined && usdcBalance < LAUNCH_FEE) {
          throw new Error(
            "Insufficient USDC balance. You need at least 0.4 USDC to launch."
          );
        }

        // Step 2: Approve USDC if needed
        const currentAllowance = allowance ?? BigInt(0);
        if (currentAllowance < LAUNCH_FEE) {
          setStep("approving");
          const approveHash = await writeContractAsync({
            address: USDC_ADDRESS,
            abi: USDC_ABI,
            functionName: "approve",
            args: [FACTORY_ADDRESS, LAUNCH_FEE],
          });
          setApproveTxHash(approveHash);

          // Wait for approval confirmation
          setStep("waiting-approval");
          // Poll until receipt is available
          await waitForTx(approveHash);
          await refetchAllowance();
        }

        // Step 3: Call createToken
        setStep("creating");
        const createHash = await writeContractAsync({
          address: FACTORY_ADDRESS,
          abi: FACTORY_ABI,
          functionName: "createToken",
          args: [tokenName.trim(), tokenSymbol.trim().toUpperCase(), BigInt(totalSupply)],
        });
        setCreateTxHash(createHash);

        // Step 4: Wait for creation confirmation
        setStep("waiting-creation");
        const receipt = await waitForTx(createHash);

        // Step 5: Parse TokenCreated event to get token address
        let tokenAddress = "";
        if (receipt?.logs) {
          for (const log of receipt.logs) {
            try {
              const decoded = decodeEventLog({
                abi: FACTORY_ABI,
                data: log.data,
                topics: log.topics,
              });
              if (decoded.eventName === "TokenCreated") {
                tokenAddress = (decoded.args as { tokenAddress: string }).tokenAddress;
                break;
              }
            } catch {
              // not our event, skip
            }
          }
        }

        if (!tokenAddress) {
          // Fallback: if we can't parse the event, still save what we have
          throw new Error("Token created but couldn't parse token address from receipt");
        }

        // Step 6: Save to database
        setStep("saving");
        await onSave(tokenAddress, createHash);

        setResult({ tokenAddress, txHash: createHash });
        setStep("done");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";

        // Handle user rejection
        if (message.includes("rejected") || message.includes("denied")) {
          setError("Transaction was rejected");
        } else {
          setError(message);
        }
        setStep("error");
      }
    },
    [address, allowance, usdcBalance, writeContractAsync, refetchAllowance]
  );

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
    setResult(null);
    setApproveTxHash(undefined);
    setCreateTxHash(undefined);
  }, []);

  return {
    step,
    error,
    result,
    launch,
    reset,
    usdcBalance,
    hasEnoughUsdc:
      usdcBalance !== undefined ? usdcBalance >= LAUNCH_FEE : undefined,
  };
}

/* ── Helper: poll for tx receipt ──────────────────────────── */

async function waitForTx(
  hash: `0x${string}`,
  maxAttempts = 60,
  intervalMs = 2000
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const { createPublicClient, http } = await import("viem");
  const { base } = await import("viem/chains");

  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const receipt = await client.getTransactionReceipt({ hash });
      if (receipt) return receipt;
    } catch {
      // not mined yet
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Transaction confirmation timed out");
}
