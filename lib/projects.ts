import type { LaunchProject } from "@/lib/types";

export const mockProjects: LaunchProject[] = [
  {
    id: "forge-pay",
    name: "ForgePay",
    description:
      "A stablecoin-first payment rail for cross-border teams. Built for fast, low-fee USDC settlements on Base.",
    creator: "0x14a9...fe31",
    status: "Live",
    tokenSymbol: "FGP",
    category: "defi",
    website: "https://forgepay.xyz",
    twitter: "https://twitter.com/forgepay",
    github: "https://github.com/forgepay",
    aiScore: 87,
    riskFlags: [],
    likes: 142,
    views: 3200,
    createdAt: "2025-12-01T10:00:00Z",
    fundingTarget: 50000,
    fundingRaised: 38500,
  },
  {
    id: "builder-score",
    name: "BuilderScore",
    description:
      "Onchain reputation and verification signals for serious founders. Aggregate wallet age, deploy history, and community trust into a single score.",
    creator: "0x7bc2...d4a1",
    status: "Live",
    tokenSymbol: "BSR",
    category: "infra",
    website: "https://builderscore.io",
    twitter: "https://twitter.com/builderscore",
    github: "https://github.com/builderscore",
    aiScore: 92,
    riskFlags: [],
    likes: 231,
    views: 5100,
    createdAt: "2025-11-15T08:30:00Z",
    fundingTarget: 75000,
    fundingRaised: 75000,
  },
  {
    id: "agent-labs",
    name: "AgentLabs",
    description:
      "AI-assisted token launch insights with risk and traction scoring. Autonomous agents evaluate projects in real-time.",
    creator: "0x9813...ab77",
    status: "Upcoming",
    tokenSymbol: "AGL",
    category: "ai",
    website: "https://agentlabs.dev",
    twitter: "https://twitter.com/agentlabs",
    aiScore: 74,
    riskFlags: ["unverified-team"],
    likes: 89,
    views: 1800,
    createdAt: "2026-01-10T14:00:00Z",
    fundingTarget: 30000,
    fundingRaised: 12400,
  },
  {
    id: "base-guild",
    name: "BaseGuild",
    description:
      "A DAO framework for launching and governing community-owned protocols on Base. Modular voting, treasury management, and proposal systems.",
    creator: "0x42f1...cc09",
    status: "Upcoming",
    tokenSymbol: "BGD",
    category: "dao",
    website: "https://baseguild.xyz",
    twitter: "https://twitter.com/baseguild",
    aiScore: 68,
    riskFlags: ["low-liquidity-plan"],
    likes: 56,
    views: 920,
    createdAt: "2026-02-01T12:00:00Z",
    fundingTarget: 40000,
    fundingRaised: 5200,
  },
  {
    id: "pixel-realm",
    name: "PixelRealm",
    description:
      "Fully onchain pixel-art gaming with tradeable NFT characters. Play-to-earn mechanics backed by Base L2 speed.",
    creator: "0xd1e8...3b44",
    status: "Draft",
    tokenSymbol: "PXR",
    category: "gaming",
    website: "https://pixelrealm.gg",
    twitter: "https://twitter.com/pixelrealm",
    aiScore: undefined,
    riskFlags: [],
    likes: 23,
    views: 410,
    createdAt: "2026-02-20T09:00:00Z",
    fundingTarget: 20000,
    fundingRaised: 0,
  },
  {
    id: "onchain-social",
    name: "OnchainSocial",
    description:
      "Decentralised social graph protocol. Own your followers, posts, and reputation across any Farcaster-compatible app.",
    creator: "0xa4b6...e712",
    status: "Live",
    tokenSymbol: "OCS",
    category: "social",
    website: "https://onchainsocial.xyz",
    twitter: "https://twitter.com/onchainsocial",
    github: "https://github.com/onchainsocial",
    aiScore: 81,
    riskFlags: [],
    likes: 178,
    views: 4300,
    createdAt: "2025-12-20T16:00:00Z",
    fundingTarget: 60000,
    fundingRaised: 52000,
  },
];

export function findProjectById(id: string): LaunchProject | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getProjectsByStatus(status: LaunchProject["status"]): LaunchProject[] {
  return mockProjects.filter((p) => p.status === status);
}

export function getProjectsByCategory(category: string): LaunchProject[] {
  return mockProjects.filter((p) => p.category === category);
}

export function getTopProjects(limit = 3): LaunchProject[] {
  return [...mockProjects]
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
    .slice(0, limit);
}
