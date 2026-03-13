"use client";

import { useEffect, useState } from "react";
import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToggleButton,
  SwapToast,
} from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { base } from "wagmi/chains";
import { AlertCircle, ArrowLeftRight } from "lucide-react";
import { USDC_ADDRESS } from "@/lib/contracts/tokenFactory";

const onchainKitApiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

const USDC: Token = {
  address: USDC_ADDRESS,
  chainId: base.id,
  decimals: 6,
  image:
    "https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png",
  name: "USDC",
  symbol: "USDC",
};

const ETH: Token = {
  address: "",
  chainId: base.id,
  decimals: 18,
  image:
    "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  name: "Ethereum",
  symbol: "ETH",
};

const CBBTC: Token = {
  address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
  chainId: base.id,
  decimals: 8,
  image:
    "https://assets.coingecko.com/coins/images/40143/large/cbbtc.webp",
  name: "Coinbase Wrapped BTC",
  symbol: "cbBTC",
};

const DAI: Token = {
  address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
  chainId: base.id,
  decimals: 18,
  image:
    "https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png",
  name: "Dai Stablecoin",
  symbol: "DAI",
};

type Props = {
  tokenAddress: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenImage?: string | null;
};

/**
 * Inline swap widget (OnchainKit SwapDefault) for trading USDC ↔ a project token.
 * Only rendered when the token address is known.
 */
export function ProjectSwapWidget({
  tokenAddress,
  tokenSymbol,
  tokenName,
  tokenImage,
}: Props) {
  const [swapError, setSwapError] = useState<string | null>(null);
  const [swapResetKey, setSwapResetKey] = useState(0);
  const [hasPendingApproval, setHasPendingApproval] = useState(false);

  useEffect(() => {
    if (!hasPendingApproval) return;

    const timeoutId = window.setTimeout(() => {
      // Some wallet paths can linger on `transactionApproved` even after
      // execution; remount Swap to return the button to idle state.
      setSwapResetKey((prev) => prev + 1);
      setHasPendingApproval(false);
      setSwapError(null);
    }, 20000);

    return () => window.clearTimeout(timeoutId);
  }, [hasPendingApproval]);

  const projectToken: Token = {
    address: tokenAddress as `0x${string}`,
    chainId: base.id,
    decimals: 18,
    image: tokenImage ?? null,
    name: tokenName ?? tokenSymbol ?? "Project Token",
    symbol: tokenSymbol?.toUpperCase() ?? "TOKEN",
  };

  const commonTokens: Token[] = [USDC, ETH, DAI, CBBTC];
  const fromTokens = [USDC, ETH, DAI, CBBTC, projectToken];
  const toTokens = [projectToken, USDC, ETH, DAI, CBBTC];

  const swapUnavailableReason = !onchainKitApiKey
    ? "Swap is unavailable because NEXT_PUBLIC_ONCHAINKIT_API_KEY is not configured in this deployment."
    : null;

  function getFriendlySwapError(error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      const message = error.message.toLowerCase();

      if (message.includes("liquidity")) {
        return "No active liquidity found for this token on Base yet. Add a USDC pool before swaps can quote or execute.";
      }
      if (message.includes("api key") || message.includes("unauthorized")) {
        return "Swap is not configured correctly for this deployment. Check the OnchainKit API key in your environment variables.";
      }

      return error.message;
    }

    return "Swap quote failed. This usually means the token does not have active liquidity yet.";
  }

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
        <div className="mb-3 rounded-xl border border-[var(--amber-border-soft)] bg-[var(--amber-muted)] px-3.5 py-3 text-sm text-[var(--text-secondary)]">
          Quotes appear only after this token has active liquidity on Base.
        </div>

        {(swapUnavailableReason || swapError) && (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-[var(--red-border,rgba(248,113,113,0.3))] bg-[var(--red-muted)] px-3.5 py-3 text-sm text-[var(--red)]">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{swapUnavailableReason ?? swapError}</span>
          </div>
        )}

        <Swap
          key={swapResetKey}
          onError={(error) => {
            setHasPendingApproval(false);
            setSwapError(getFriendlySwapError(error));
          }}
          onStatus={(status) => {
            if (status.statusName === "transactionApproved") {
              setHasPendingApproval(true);
            }

            if (
              status.statusName === "init" ||
              status.statusName === "amountChange" ||
              status.statusName === "success" ||
              status.statusName === "error"
            ) {
              setHasPendingApproval(false);
              setSwapError(null);
            }
          }}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 sm:p-4"
        >
          <SwapAmountInput
            label="Pay"
            token={USDC}
            type="from"
            swappableTokens={fromTokens}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] [&_input]:!text-[1.25rem] sm:[&_input]:!text-[1.4rem]"
          />
          <SwapToggleButton className="mx-auto mt-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-main)]" />
          <SwapAmountInput
            label="Receive"
            token={projectToken}
            type="to"
            swappableTokens={toTokens}
            className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] [&_input]:!text-[1.25rem] sm:[&_input]:!text-[1.4rem]"
          />
          <SwapButton
            disabled={Boolean(swapUnavailableReason)}
            className="mt-3 min-h-[44px] rounded-xl bg-[var(--accent)] text-sm font-semibold text-[var(--button-text)]"
          />
          <SwapMessage className="mt-2 text-xs text-[var(--text-secondary)]" />
          <p className="mt-2 text-[11px] text-[var(--text-dim)]">
            Available pairs here: {commonTokens.map((token) => token.symbol).join(", ")} and {projectToken.symbol}.
          </p>
          <SwapToast position="bottom-center" />
        </Swap>
      </div>
    </div>
  );
}
