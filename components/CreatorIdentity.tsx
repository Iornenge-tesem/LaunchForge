"use client";

import {
  Avatar,
  useName,
} from "@coinbase/onchainkit/identity";
import { base } from "wagmi/chains";

type Props = {
  address: `0x${string}`;
  /** Farcaster display name fallback */
  displayName?: string;
  /** Farcaster PFP fallback */
  pfpUrl?: string;
  /** Farcaster username fallback (shown as @handle) */
  username?: string;
  /** Visual size of the avatar */
  size?: "sm" | "md";
};

/**
 * Resolves a wallet address to its Basename on Base.
 * Falls back to Farcaster social profile if no Basename is registered,
 * and finally to the raw truncated address.
 */
export function CreatorIdentity({
  address,
  displayName,
  pfpUrl,
  username,
  size = "sm",
}: Props) {
  const avatarSize = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const { data: basename } = useName({ address, chain: base });
  const fallbackName =
    displayName ||
    (username ? `@${username}` : `${address.slice(0, 6)}…${address.slice(-4)}`);
  const visibleName = basename || fallbackName;

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Avatar
        address={address}
        chain={base}
        className={`${avatarSize} rounded-full object-cover`}
        defaultComponent={
          pfpUrl ? (
            <img
              src={pfpUrl}
              alt={fallbackName}
              className={`${avatarSize} rounded-full object-cover`}
            />
          ) : (
            <span
              className={`${avatarSize} flex items-center justify-center rounded-full bg-[var(--accent-muted)] text-[10px] font-bold text-[var(--accent)]`}
            >
              {fallbackName[0]?.toUpperCase() ?? "?"}
            </span>
          )
        }
      />
      <span className="truncate text-sm font-medium text-[var(--text-main)]">
        {visibleName}
      </span>
    </span>
  );
}
