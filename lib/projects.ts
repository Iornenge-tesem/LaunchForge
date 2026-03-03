export type LaunchProject = {
  id: string;
  name: string;
  description: string;
  creator: string;
  status: "Live" | "Upcoming" | "Draft";
  tokenSymbol: string;
  website: string;
  twitter: string;
  category: string;
};

export const mockProjects: LaunchProject[] = [
  {
    id: "forge-pay",
    name: "ForgePay",
    description: "A stablecoin-first payment rail for cross-border teams.",
    creator: "0x14a9...fe31",
    status: "Live",
    tokenSymbol: "FGP",
    website: "https://example.com/forgepay",
    twitter: "https://twitter.com/forgepay",
    category: "defi",
  },
  {
    id: "builder-score",
    name: "BuilderScore",
    description: "Onchain reputation and verification signals for serious founders.",
    creator: "0x7bc2...d4a1",
    status: "Upcoming",
    tokenSymbol: "BSR",
    website: "https://example.com/builderscore",
    twitter: "https://twitter.com/builderscore",
    category: "infra",
  },
  {
    id: "agent-labs",
    name: "AgentLabs",
    description: "AI-assisted token launch insights with risk and traction scoring.",
    creator: "0x9813...ab77",
    status: "Draft",
    tokenSymbol: "AGL",
    website: "https://example.com/agentlabs",
    twitter: "https://twitter.com/agentlabs",
    category: "ai",
  },
];

export function findProjectById(id: string) {
  return mockProjects.find((project) => project.id === id);
}
