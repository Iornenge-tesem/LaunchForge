"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTokenLaunch, type LaunchStep } from "@/lib/contracts/useTokenLaunch";
import { useMiniAppProfile } from "@/components/providers";
import { TokenLiquidityPanel } from "@/components/TokenLiquidityPanel";
import {
  Rocket,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Coins,
  ExternalLink,
} from "lucide-react";

type TokenLauncherProps = {
  projectId: string;
  projectName: string;
  /** Pre-filled symbol from project */
  defaultSymbol?: string;
  /** Called after successful token creation */
  onSuccess?: (tokenAddress: string) => void;
};

const STEP_LABELS: Record<LaunchStep, string> = {
  idle: "",
  checking: "Checking USDC balance...",
  approving: "Approve USDC spend in your wallet...",
  "waiting-approval": "Waiting for approval confirmation...",
  creating: "Confirm token creation in your wallet...",
  "waiting-creation": "Deploying token on Base... this may take a moment",
  saving: "Saving to database...",
  done: "Token deployed successfully!",
  error: "Something went wrong",
};

export function TokenLauncher({
  projectId,
  projectName,
  defaultSymbol = "",
  onSuccess,
}: TokenLauncherProps) {
  const { address, isConnected } = useMiniAppProfile();
  const { step, error, result, launch, reset, hasEnoughUsdc } =
    useTokenLaunch();

  const [tokenName, setTokenName] = useState(projectName);
  const [tokenSymbol, setTokenSymbol] = useState(defaultSymbol);
  const [totalSupply, setTotalSupply] = useState("1000000");
  const [formError, setFormError] = useState("");

  const isProcessing =
    step !== "idle" && step !== "done" && step !== "error";

  async function handleLaunch() {
    setFormError("");

    if (!tokenName.trim()) {
      setFormError("Token name is required");
      return;
    }
    if (!tokenSymbol.trim()) {
      setFormError("Token symbol is required");
      return;
    }
    if (tokenSymbol.trim().length > 10) {
      setFormError("Symbol must be 10 characters or less");
      return;
    }

    const supply = parseInt(totalSupply.replace(/,/g, ""), 10);
    if (isNaN(supply) || supply <= 0) {
      setFormError("Supply must be a positive number");
      return;
    }
    if (supply > 10_000_000_000) {
      setFormError("Supply cannot exceed 10 billion");
      return;
    }

    await launch(tokenName.trim(), tokenSymbol.trim(), supply, async (tokenAddress, txHash) => {
      // Save to DB via API
      await fetch(`/api/projects/${encodeURIComponent(projectId)}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAddress,
          txHash,
          tokenName: tokenName.trim(),
          tokenSymbol: tokenSymbol.trim().toUpperCase(),
          tokenSupply: supply,
          wallet: address,
        }),
      });
      onSuccess?.(tokenAddress);
    });
  }

  // Not connected
  if (!isConnected) {
    return (
      <Card padding="lg">
        <div className="text-center">
          <Coins size={32} className="mx-auto mb-3 text-[var(--text-dim)]" />
          <p className="text-sm text-[var(--text-secondary)]">
            Connect your wallet to create a token
          </p>
        </div>
      </Card>
    );
  }

  // Success state
  if (step === "done" && result) {
    return (
      <Card padding="lg" className="border-[var(--green-border-soft)] bg-[var(--green-muted)]">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-[var(--green)]" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[var(--text-main)]">
              Token Deployed!
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Your {tokenSymbol.toUpperCase()} token is live on Base.
            </p>
            <div className="mt-4">
              <TokenLiquidityPanel
                tokenAddress={result.tokenAddress}
                tokenSymbol={tokenSymbol}
                canManageLiquidity={true}
              />
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-dim)]">Address:</span>
                <code className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs font-mono text-[var(--text-main)]">
                  {result.tokenAddress.slice(0, 10)}...{result.tokenAddress.slice(-8)}
                </code>
                <a
                  href={`https://basescan.org/token/${result.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--text-main)]">
        <Coins size={18} className="text-[var(--accent)]" />
        Create Token
      </h3>

      {/* USDC balance warning */}
      {hasEnoughUsdc === false && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--red-border-soft)] bg-[var(--red-muted)] p-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--red)]" />
          <p className="text-sm text-[var(--red)]">
            Insufficient USDC. You need at least 0.1 USDC on Base to launch.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Token Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Token Name
          </label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="e.g. ForgeToken"
            disabled={isProcessing}
            className="h-[44px] w-full rounded-xl border border-[var(--input-border)] bg-[var(--bg-elevated)] px-4 text-sm text-[var(--text-main)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent-border-soft)] focus:ring-2 focus:ring-[var(--accent-muted)] disabled:opacity-50"
          />
        </div>

        {/* Token Symbol */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Token Symbol
          </label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
            placeholder="e.g. FRG"
            maxLength={10}
            disabled={isProcessing}
            className="h-[44px] w-full rounded-xl border border-[var(--input-border)] bg-[var(--bg-elevated)] px-4 text-sm font-mono uppercase text-[var(--text-main)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent-border-soft)] focus:ring-2 focus:ring-[var(--accent-muted)] disabled:opacity-50"
          />
        </div>

        {/* Total Supply */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Total Supply
          </label>
          <input
            type="text"
            value={totalSupply}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              setTotalSupply(val);
            }}
            placeholder="e.g. 1000000"
            disabled={isProcessing}
            className="h-[44px] w-full rounded-xl border border-[var(--input-border)] bg-[var(--bg-elevated)] px-4 text-sm font-mono text-[var(--text-main)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent-border-soft)] focus:ring-2 focus:ring-[var(--accent-muted)] disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-[var(--text-dim)]">
            Entire supply minted to your wallet. No additional minting possible.
          </p>
        </div>

        {/* Form error */}
        {(formError || error) && (
          <div className="flex items-start gap-2 rounded-xl border border-[var(--red-border-soft)] bg-[var(--red-muted)] p-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--red)]" />
            <p className="text-sm text-[var(--red)]">{formError || error}</p>
          </div>
        )}

        {/* Step indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 rounded-xl bg-[var(--accent-muted)] p-3">
            <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
            <p className="text-sm font-medium text-[var(--accent)]">
              {STEP_LABELS[step]}
            </p>
          </div>
        )}

        {/* Fee notice */}
        <p className="text-xs text-[var(--text-dim)]">
          Launch fee: <span className="font-medium text-[var(--text-secondary)]">0.1 USDC</span> (paid on Base)
        </p>

        {/* Launch button */}
        <Button
          size="lg"
          fullWidth
          disabled={isProcessing || hasEnoughUsdc === false}
          onClick={handleLaunch}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Rocket size={18} />
              Launch Token — 0.1 USDC
            </>
          )}
        </Button>

        {/* Reset on error */}
        {step === "error" && (
          <Button variant="ghost" size="sm" onClick={reset} fullWidth>
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
}
