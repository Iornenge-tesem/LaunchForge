"use client";

import { useState } from "react";
import { USDC_ADDRESS } from "@/lib/contracts/tokenFactory";
import { Droplets, ExternalLink, Copy, Check } from "lucide-react";

type TokenLiquidityPanelProps = {
  tokenAddress: string;
  tokenSymbol?: string;
  canManageLiquidity?: boolean;
};

export function TokenLiquidityPanel({
  tokenAddress,
  tokenSymbol,
  canManageLiquidity = false,
}: TokenLiquidityPanelProps) {
  const [copied, setCopied] = useState(false);

  const addLiquidityUrl = `https://app.uniswap.org/positions/create/v2?chain=base&currencyA=${USDC_ADDRESS}&currencyB=${tokenAddress}`;
  const swapUrl = `https://app.uniswap.org/swap?chain=base&inputCurrency=${USDC_ADDRESS}&outputCurrency=${tokenAddress}`;

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(tokenAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--amber-border-soft)] bg-[var(--amber-muted)] p-4 sm:p-5">
      <p className="text-sm font-semibold text-[var(--amber)]">Liquidity setup required before buys</p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
        Newly deployed tokens are not tradable until you add a pool (for example USDC/{tokenSymbol?.toUpperCase() || "TOKEN"}) on Base.
      </p>

      {canManageLiquidity ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <a
            href={addLiquidityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--amber-border-soft)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-semibold text-[var(--amber)] transition-opacity hover:opacity-90"
          >
            <Droplets size={15} />
            Add Liquidity
          </a>
          <a
            href={swapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--accent-border-soft)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-semibold text-[var(--accent)] transition-opacity hover:opacity-90"
          >
            <ExternalLink size={15} />
            Open Swap
          </a>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          Liquidity setup is restricted to the token creator.
        </div>
      )}

      <button
        type="button"
        onClick={copyAddress}
        className="mt-3 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-main)] transition-colors hover:border-[var(--border-hover)]"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Copied token address" : "Copy token address"}
      </button>
    </div>
  );
}
