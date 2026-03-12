"use client";

import {
  Avatar,
  useName,
} from "@coinbase/onchainkit/identity";
import { base } from "wagmi/chains";

type Props = {
  address: `0x${string}`;
  /** Farcaster display name from DB */
  displayName?: string;
  /** Farcaster PFP from DB */
  pfpUrl?: string;
  /** Farcaster username fallback (shown as @handle) */
  username?: string;
  /** Visual size of the avatar */
  size?: "sm" | "md";
  /** If true, open creator Base profile when clicked */
  linkToBaseProfile?: boolean;
};

/**
 * Prioritizes Farcaster profile data saved in DB for avatar and display name.
 * Optionally links identity to a Base profile page when available.
 */
export function CreatorIdentity({
  address,
  displayName,
  pfpUrl,
  username,
  size = "sm",
  linkToBaseProfile = false,
}: Props) {
  const avatarSize = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const { data: basename } = useName({ address, chain: base });
  const fallbackName =
    displayName ||
    (username
      ? `@${username}`
      : basename || `${address.slice(0, 6)}…${address.slice(-4)}`);
  const profileHref = basename
    ? `https://www.base.org/name/${encodeURIComponent(basename)}`
    : `https://basescan.org/address/${address}`;

  const content = (
    <span className="inline-flex min-w-0 items-center gap-2">
      {pfpUrl ? (
        <img
          src={pfpUrl}
          alt={fallbackName}
          className={`${avatarSize} rounded-full object-cover`}
        />
      ) : (
        <Avatar
          address={address}
          chain={base}
          className={`${avatarSize} rounded-full object-cover`}
          defaultComponent={
            <span
              className={`${avatarSize} flex items-center justify-center rounded-full bg-[var(--accent-muted)] text-[10px] font-bold text-[var(--accent)]`}
            >
              {fallbackName[0]?.toUpperCase() ?? "?"}
            </span>
          }
        />
      )}
      <span className="truncate text-sm font-medium text-[var(--text-main)]">
        {fallbackName}
      </span>
    </span>
  );

  if (!linkToBaseProfile) {
    return content;
  }

  return (
    <a
      href={profileHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full rounded-md outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      title="Open Base profile"
    >
      {content}
    </a>
  );
}
