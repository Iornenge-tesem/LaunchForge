/* ── LaunchForge Core Types ────────────────────────────────── */

export type ProjectStatus = "Live" | "Upcoming" | "Draft" | "Ended";

export type ProjectCategory =
  | "defi"
  | "nft"
  | "infra"
  | "ai"
  | "social"
  | "gaming"
  | "dao"
  | "other";

export type LaunchProject = {
  id: string;
  name: string;
  description: string;
  creator: string;
  status: ProjectStatus;
  tokenSymbol: string;
  category: ProjectCategory;
  website: string;
  twitter: string;
  github?: string;
  /** AI score 0–100, undefined = not yet scored */
  aiScore?: number;
  /** AI risk flags */
  riskFlags?: string[];
  /** Engagement metrics */
  likes: number;
  views: number;
  createdAt: string; // ISO date
  /** Icon / logo URL */
  logoUrl?: string;
  /** Funding target in USDC */
  fundingTarget?: number;
  /** Funding raised so far in USDC */
  fundingRaised?: number;
};

export type CreateProjectInput = {
  name: string;
  description: string;
  tokenSymbol?: string;
  category: ProjectCategory;
  website?: string;
  twitter?: string;
  github?: string;
  fundingTarget?: number;
};

export type AIScoreResult = {
  score: number;
  summary: string;
  riskFlags: string[];
  reputationCheck: {
    walletAge: string;
    priorProjects: number;
    trustLevel: "high" | "medium" | "low" | "unknown";
  };
};

export type AnalyticsData = {
  totalProjects: number;
  liveProjects: number;
  totalViews: number;
  totalLikes: number;
  topProjects: { id: string; name: string; views: number }[];
};
