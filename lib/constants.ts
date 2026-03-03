/* ── LaunchForge Constants ─────────────────────────────────── */

export const APP_NAME = "LaunchForge";
export const APP_TAGLINE = "The launchpad for serious builders.";
export const APP_DESCRIPTION =
  "A launchpad for real builders and experimental ideas on Base.";

/** x402 payment amounts in USDC */
export const PAYMENT = {
  PROJECT_CREATE: 0.01,
  ANALYTICS_FETCH: 0.001,
} as const;

/** Chain IDs */
export const CHAINS = {
  BASE_MAINNET: "eip155:8453",
  BASE_TESTNET: "eip155:84532",
} as const;

/** Category display labels */
export const CATEGORY_LABELS: Record<string, string> = {
  defi: "DeFi",
  nft: "NFT",
  infra: "Infrastructure",
  ai: "AI",
  social: "Social",
  gaming: "Gaming",
  dao: "DAO",
  other: "Other",
};

/** Status badge colors */
export const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  Live: {
    bg: "var(--green-muted)",
    text: "var(--green)",
    border: "rgba(52,211,153,0.2)",
    dot: "var(--green)",
  },
  Upcoming: {
    bg: "var(--accent-muted)",
    text: "var(--accent)",
    border: "rgba(77,163,255,0.2)",
    dot: "var(--accent)",
  },
  Draft: {
    bg: "rgba(176,176,176,0.08)",
    text: "var(--text-dim)",
    border: "var(--border)",
    dot: "var(--text-dim)",
  },
  Ended: {
    bg: "var(--red-muted)",
    text: "var(--red)",
    border: "rgba(248,113,113,0.2)",
    dot: "var(--red)",
  },
};
