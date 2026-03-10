"use client";

import { useState, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useConfig,
  useBalance,
} from "wagmi";
import { waitForTransactionReceipt, readContract } from "@wagmi/core";
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

/** Human-readable launch fee */
const LAUNCH_FEE_DISPLAY = "0.1 USDC";

export function useTokenLaunch() {
  const { address } = useAccount();
  const [step, setStep] = useState<LaunchStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchResult | null>(null);
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>();
  const [createTxHash, setCreateTxHash] = useState<`0x${string}` | undefined>();

  // wagmi config — needed for waitForTransactionReceipt which handles Smart Wallet UserOp hashes
  const config = useConfig();

  // Read USDC allowance for the factory
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "allowance",
    args: address && FACTORY_ADDRESS ? [address, FACTORY_ADDRESS] : undefined,
    query: { enabled: !!address && !!FACTORY_ADDRESS },
  });

  // Read USDC balance
  const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read native ETH balance (needed for gas)
  const { data: ethBalance } = useBalance({ address });

  const { writeContractAsync } = useWriteContract();

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

        // Step 1: Fresh on-chain balance check (don't rely on potentially stale cache)
        setStep("checking");
        const freshBalance = await readContract(config, {
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: "balanceOf",
          args: [address],
        });
        // Update the cached value
        refetchBalance();

        if (freshBalance < LAUNCH_FEE) {
          const have = (Number(freshBalance) / 1e6).toFixed(4);
          throw new Error(
            `Insufficient USDC. You have ${have} USDC but need ${LAUNCH_FEE_DISPLAY} to launch.`
          );
        }

        // Step 2: Fresh allowance check & approve if needed
        const freshAllowance = await readContract(config, {
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: "allowance",
          args: [address, FACTORY_ADDRESS],
        });

        if (freshAllowance < LAUNCH_FEE) {
          setStep("approving");
          const approveHash = await writeContractAsync({
            address: USDC_ADDRESS,
            abi: USDC_ABI,
            functionName: "approve",
            args: [FACTORY_ADDRESS, LAUNCH_FEE],
          });
          setApproveTxHash(approveHash);

          // Wait for approval confirmation (wagmi handles Smart Wallet UserOp hashes)
          setStep("waiting-approval");
          await waitForTransactionReceipt(config, { hash: approveHash });
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

        // Step 4: Wait for creation confirmation (wagmi handles Smart Wallet UserOp hashes)
        setStep("waiting-creation");
        const receipt = await waitForTransactionReceipt(config, { hash: createHash });

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

        // Translate generic wallet/bundler errors into actionable messages
        if (message.includes("rejected") || message.includes("denied")) {
          setError("Transaction was rejected in your wallet.");
        } else if (
          message.toLowerCase().includes("insufficient funds") ||
          message.toLowerCase().includes("enough funds") ||
          message.toLowerCase().includes("error generating transaction")
        ) {
          // The wallet simulation detected the tx would revert — usually means
          // not enough USDC for the fee or not enough ETH for gas.
          const bal = usdcBalance !== undefined
            ? (Number(usdcBalance) / 1e6).toFixed(4) + " USDC"
            : "unknown";
          setError(
            `Transaction cannot be completed. Your USDC balance is ${bal} ` +
            `but the launch fee is ${LAUNCH_FEE_DISPLAY}. ` +
            `Make sure you have at least ${LAUNCH_FEE_DISPLAY} and a small amount of ETH for gas on Base.`
          );
        } else {
          setError(message);
        }
        setStep("error");
      }
    },
    [address, usdcBalance, writeContractAsync, refetchAllowance, refetchBalance, config]
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
    ethBalance: ethBalance?.value,
    hasEnoughUsdc:
      usdcBalance !== undefined ? usdcBalance >= LAUNCH_FEE : undefined,
  };
}
