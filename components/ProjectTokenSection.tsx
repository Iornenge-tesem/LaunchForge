"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TokenLauncher } from "@/components/TokenLauncher";
import { TokenLiquidityPanel } from "@/components/TokenLiquidityPanel";
import { useMiniAppProfile } from "@/components/providers";
import { Coins, ExternalLink, Copy, Check } from "lucide-react";

type Props = {
  projectId: string;
  projectName: string;
  tokenSymbol?: string;
  tokenAddress?: string;
  tokenSupply?: number;
  creatorWallet: string;
};

/**
 * Shows token info if deployed, or the TokenLauncher form if the
 * connected wallet matches the project creator.
 */
export function ProjectTokenSection({
  projectId,
  projectName,
  tokenSymbol,
  tokenAddress,
  tokenSupply,
  creatorWallet,
}: Props) {
  const { address } = useMiniAppProfile();
  const [copiedField, setCopiedField] = useState<"token" | null>(null);

  const isCreator =
    address && creatorWallet && address.toLowerCase() === creatorWallet.toLowerCase();

  async function copyValue(value: string, field: "token") {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1400);
    } catch {
      // no-op
    }
  }

  // Token already deployed — show info
  if (tokenAddress) {
    return (
      <Card padding="lg">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          Token
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-[var(--bg-elevated)] px-4 py-3">
            <span className="text-sm font-medium text-[var(--text-dim)]">Name</span>
            <span className="text-sm font-semibold text-[var(--text-main)]">
              {projectName}
            </span>
          </div>
          {tokenSymbol && (
            <div className="flex items-center justify-between rounded-xl bg-[var(--bg-elevated)] px-4 py-3">
              <span className="text-sm font-medium text-[var(--text-dim)]">Symbol</span>
              <span className="text-sm font-mono font-semibold text-[var(--text-main)]">
                ${tokenSymbol}
              </span>
            </div>
          )}
          {tokenSupply && (
            <div className="flex items-center justify-between rounded-xl bg-[var(--bg-elevated)] px-4 py-3">
              <span className="text-sm font-medium text-[var(--text-dim)]">Supply</span>
              <span className="text-sm font-semibold text-[var(--text-main)]">
                {tokenSupply.toLocaleString()}
              </span>
            </div>
          )}

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">Contract Address</p>
            <p className="mt-2 break-all rounded-lg bg-[var(--bg-elevated)] px-3 py-2 font-mono text-xs text-[var(--text-main)]">
              {tokenAddress}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => copyValue(tokenAddress, "token")}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--text-main)] transition-colors hover:border-[var(--border-hover)]"
              >
                {copiedField === "token" ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === "token" ? "Copied" : "Copy address"}
              </button>
              <a
                href={`https://basescan.org/token/${tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--accent-border-soft)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-90"
              >
                <ExternalLink size={14} />
                Open on BaseScan
              </a>
            </div>
          </div>

          <TokenLiquidityPanel
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            canManageLiquidity={Boolean(isCreator)}
          />
        </div>
      </Card>
    );
  }

  // Only the project creator can launch a token
  if (!isCreator) {
    return (
      <Card padding="lg">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          Token
        </h2>
        <div className="rounded-xl bg-[var(--bg-elevated)] p-5 text-center">
          <Coins size={28} className="mx-auto mb-3 text-[var(--text-dim)]" />
          <p className="text-sm text-[var(--text-secondary)]">
            No token launched yet. Only the project creator can launch a token.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <TokenLauncher
      projectId={projectId}
      projectName={projectName}
      defaultSymbol={tokenSymbol ?? ""}
      onSuccess={() => {
        // Reload page to show token info
        window.location.reload();
      }}
    />
  );
}
