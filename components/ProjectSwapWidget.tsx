"use client";

import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToast,
} from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { base } from "wagmi/chains";
import { ArrowLeftRight } from "lucide-react";

const USDC: Token = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chainId: base.id,
  decimals: 6,
  image:
    "https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png",
  name: "USDC",
  symbol: "USDC",
};

type Props = {
  tokenAddress: string;
  tokenSymbol?: string;
  tokenName?: string;
};

/**
 * Inline swap widget (OnchainKit SwapDefault) for trading USDC ↔ a project token.
 * Only rendered when the token address is known.
 */
export function ProjectSwapWidget({ tokenAddress, tokenSymbol, tokenName }: Props) {
  const projectToken: Token = {
    address: tokenAddress as `0x${string}`,
    chainId: base.id,
    decimals: 18,
    image: null,
    name: tokenName ?? tokenSymbol ?? "Project Token",
    symbol: tokenSymbol?.toUpperCase() ?? "TOKEN",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--accent-border-soft)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--accent-muted)]/35 px-5 py-3.5">
        <ArrowLeftRight size={15} className="text-[var(--accent)]" />
        <span className="text-sm font-semibold text-[var(--text-main)]">
          Swap USDC for ${tokenSymbol?.toUpperCase() ?? "TOKEN"}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <Swap className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 sm:p-4">
          <SwapAmountInput
            label="Pay"
            token={USDC}
            type="from"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] [&_input]:!text-[1.25rem] sm:[&_input]:!text-[1.4rem]"
          />
          <SwapAmountInput
            label="Receive"
            token={projectToken}
            type="to"
            className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] [&_input]:!text-[1.25rem] sm:[&_input]:!text-[1.4rem]"
          />
          <SwapButton
            className="mt-3 min-h-[44px] rounded-xl bg-[var(--accent)] text-sm font-semibold text-[var(--button-text)]"
          />
          <SwapMessage className="mt-2 text-xs text-[var(--text-secondary)]" />
          <SwapToast position="bottom-center" />
        </Swap>
      </div>
    </div>
  );
}
