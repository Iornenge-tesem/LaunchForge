"use client";

import { Card } from "@/components/ui/Card";
import { TokenLauncher } from "@/components/TokenLauncher";
import { useMiniAppProfile } from "@/components/providers";
import { Coins, ExternalLink } from "lucide-react";

type Props = {
  projectId: string;
  projectName: string;
  tokenSymbol?: string;
  tokenAddress?: string;
  tokenSupply?: number;
  tokenTxHash?: string;
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
  tokenTxHash,
  creatorWallet,
}: Props) {
  const { address } = useMiniAppProfile();

  // Token already deployed — show info
  if (tokenAddress) {
    return (
      <Card padding="lg">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          Token
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-dim)]">Name</span>
            <span className="text-sm font-medium text-[var(--text-main)]">
              {projectName}
            </span>
          </div>
          {tokenSymbol && (
            <>
              <div className="h-px bg-[var(--border)]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-dim)]">Symbol</span>
                <span className="text-sm font-mono font-medium text-[var(--text-main)]">
                  ${tokenSymbol}
                </span>
              </div>
            </>
          )}
          {tokenSupply && (
            <>
              <div className="h-px bg-[var(--border)]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-dim)]">Supply</span>
                <span className="text-sm font-medium text-[var(--text-main)]">
                  {tokenSupply.toLocaleString()}
                </span>
              </div>
            </>
          )}
          <div className="h-px bg-[var(--border)]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-dim)]">Contract</span>
            <a
              href={`https://basescan.org/token/${tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
            >
              {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
              <ExternalLink size={12} />
            </a>
          </div>
          {tokenTxHash && (
            <>
              <div className="h-px bg-[var(--border)]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-dim)]">Tx</span>
                <a
                  href={`https://basescan.org/tx/${tokenTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
                >
                  View on BaseScan
                  <ExternalLink size={12} />
                </a>
              </div>
            </>
          )}
        </div>
      </Card>
    );
  }

  // Only the project creator can launch a token
  const isCreator =
    address && creatorWallet && address.toLowerCase() === creatorWallet.toLowerCase();

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
