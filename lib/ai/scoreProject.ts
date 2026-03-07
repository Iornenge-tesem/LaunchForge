import type { CreateProjectInput } from "@/lib/types";
import { getSupabase } from "@/lib/db/supabase";

// ── Red-flag phrases that indicate scams or low-quality projects ──────────

const RED_FLAG_PHRASES = [
  "guaranteed returns",
  "100x",
  "1000x",
  "get rich",
  "moonshot guaranteed",
  "risk free",
  "risk-free",
  "no risk",
  "free money",
  "double your",
  "send me",
  "not a scam",
  "trust me",
  "rug proof",
  "rugproof",
  "can't lose",
  "next bitcoin",
  "next ethereum",
  "pump and dump",
  "buy now",
  "limited time",
  "act fast",
  "don't miss out",
  "airdrop guaranteed",
];

const VAGUE_DESCRIPTION_PHRASES = [
  "to the moon",
  "gonna make it",
  "lambo",
  "just trust",
  "coming soon",
  "more details later",
  "tba",
  "tbd",
];

// ── Scoring result type ──────────────────────────────────────────────────

export type ScoreBreakdown = {
  descriptionQuality: number; // 0–20
  socialProof: number; // 0–15
  tokenomicsFlags: number; // 0–15
  categoryFit: number; // 0–10
  creatorHistory: number; // 0–15
  fundingRealism: number; // 0–15
  duplicateCheck: number; // 0–10
};

export type ScoringResult = {
  score: number; // 0–100
  breakdown: ScoreBreakdown;
  riskFlags: string[];
};

// ── Category keyword maps (for category-fit scoring) ─────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  defi: [
    "swap", "lend", "borrow", "yield", "liquidity", "amm", "dex",
    "staking", "vault", "pool", "farming", "protocol", "tvl", "collateral",
  ],
  nft: [
    "nft", "collectible", "mint", "artwork", "digital art", "marketplace",
    "collection", "pfp", "generative", "royalt",
  ],
  infra: [
    "infrastructure", "rpc", "node", "indexer", "oracle", "bridge",
    "sdk", "api", "tooling", "developer", "devtool", "framework",
  ],
  ai: [
    "ai", "machine learning", "ml", "neural", "model", "llm", "gpt",
    "agent", "autonomous", "intelligence", "training", "inference",
  ],
  social: [
    "social", "community", "chat", "messaging", "profile", "feed",
    "follow", "friend", "network", "content", "creator",
  ],
  gaming: [
    "game", "gaming", "play", "player", "esport", "metaverse", "virtual world",
    "rpg", "pvp", "quest", "reward", "item", "character",
  ],
  dao: [
    "dao", "governance", "vote", "voting", "proposal", "treasury",
    "multisig", "council", "delegate", "on-chain governance",
  ],
};

// Realistic funding ranges per category (in USDC)
const FUNDING_RANGES: Record<string, { min: number; max: number }> = {
  defi: { min: 1000, max: 5000000 },
  nft: { min: 500, max: 1000000 },
  infra: { min: 5000, max: 10000000 },
  ai: { min: 2000, max: 5000000 },
  social: { min: 1000, max: 3000000 },
  gaming: { min: 2000, max: 5000000 },
  dao: { min: 500, max: 2000000 },
  other: { min: 500, max: 5000000 },
};

// ── Scoring functions ────────────────────────────────────────────────────

function scoreDescriptionQuality(description: string): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 0;
  const len = description.trim().length;
  const wordCount = description.trim().split(/\s+/).length;

  // Length rewards
  if (len >= 50) score += 4;
  if (len >= 150) score += 4;
  if (len >= 300) score += 4;
  if (len >= 500) score += 3;

  // Sentence structure (has punctuation = more thought out)
  const sentences = description.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  if (sentences.length >= 2) score += 2;
  if (sentences.length >= 4) score += 1;

  // Caps lock penalty
  const upperRatio = (description.match(/[A-Z]/g)?.length ?? 0) / Math.max(len, 1);
  if (upperRatio > 0.5 && len > 20) {
    score = Math.max(score - 4, 0);
    flags.push("Excessive caps lock in description");
  }

  // Very short description
  if (wordCount < 10) {
    flags.push("Very short description");
  }

  // Red flag phrases
  const descLower = description.toLowerCase();
  for (const phrase of RED_FLAG_PHRASES) {
    if (descLower.includes(phrase)) {
      score = Math.max(score - 5, 0);
      flags.push(`Red flag phrase: "${phrase}"`);
    }
  }

  // Vague phrases
  for (const phrase of VAGUE_DESCRIPTION_PHRASES) {
    if (descLower.includes(phrase)) {
      score = Math.max(score - 2, 0);
      flags.push(`Vague language: "${phrase}"`);
    }
  }

  return { score: Math.min(score, 20), flags };
}

function scoreSocialProof(input: CreateProjectInput): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 0;

  if (input.website && input.website.trim()) score += 5;
  if (input.twitter && input.twitter.trim()) score += 4;
  if (input.github && input.github.trim()) score += 6; // GitHub = strongest signal

  if (!input.website && !input.twitter && !input.github) {
    flags.push("No social links provided");
  }

  return { score: Math.min(score, 15), flags };
}

function scoreTokenomicsFlags(input: CreateProjectInput): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 10; // Start with a baseline, deduct for issues

  const descLower = input.description.toLowerCase();

  // No token symbol — neutral, not all projects need tokens
  if (!input.tokenSymbol) {
    score += 5; // Having no token is actually fine/good
  } else {
    // Has token — check for red flags in description
    const hasUtilityMention = /utility|use case|governance|staking|access|reward/i.test(input.description);
    if (hasUtilityMention) {
      score += 5;
    } else {
      score = Math.max(score - 3, 0);
      flags.push("Token declared but no utility described");
    }

    // Check for meme-only indicators
    const memeIndicators = ["meme", "doge", "pepe", "shib", "moon", "wen", "wagmi"];
    const isMemeOnly = memeIndicators.some((m) => descLower.includes(m)) &&
      !hasUtilityMention;
    if (isMemeOnly) {
      score = Math.max(score - 5, 0);
      flags.push("Appears to be meme-only with no utility");
    }
  }

  return { score: Math.min(score, 15), flags };
}

function scoreCategoryFit(input: CreateProjectInput): { score: number; flags: string[] } {
  const flags: string[] = [];
  const keywords = CATEGORY_KEYWORDS[input.category];

  // "other" category or no keywords defined — give benefit of the doubt
  if (!keywords || input.category === "other") {
    return { score: 6, flags };
  }

  const descLower = input.description.toLowerCase();
  const matches = keywords.filter((kw) => descLower.includes(kw));

  if (matches.length >= 3) return { score: 10, flags };
  if (matches.length >= 2) return { score: 8, flags };
  if (matches.length >= 1) return { score: 6, flags };

  flags.push(`Description doesn't match "${input.category}" category well`);
  return { score: 2, flags };
}

async function scoreCreatorHistory(creatorWallet: string): Promise<{ score: number; flags: string[] }> {
  const flags: string[] = [];

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("projects")
      .select("ai_score")
      .eq("creator_wallet", creatorWallet);

    const priorProjects = data?.length ?? 0;

    if (priorProjects === 0) {
      // First project — neutral
      return { score: 7, flags: ["First-time creator"] };
    }

    let score = 5; // base for having history

    // Bonus for number of prior projects
    if (priorProjects >= 1) score += 3;
    if (priorProjects >= 3) score += 2;

    // Bonus for average past score
    const scoredProjects = data?.filter((p) => p.ai_score !== null) ?? [];
    if (scoredProjects.length > 0) {
      const avgScore =
        scoredProjects.reduce((sum, p) => sum + (p.ai_score ?? 0), 0) /
        scoredProjects.length;
      if (avgScore >= 70) score += 5;
      else if (avgScore >= 50) score += 3;
      else if (avgScore < 30) {
        score = Math.max(score - 3, 0);
        flags.push("Creator's past projects scored poorly");
      }
    }

    return { score: Math.min(score, 15), flags };
  } catch {
    // If DB lookup fails, give neutral score
    return { score: 7, flags };
  }
}

function scoreFundingRealism(input: CreateProjectInput): { score: number; flags: string[] } {
  const flags: string[] = [];

  // No funding target — that's fine
  if (!input.fundingTarget || input.fundingTarget <= 0) {
    return { score: 10, flags };
  }

  const range = FUNDING_RANGES[input.category] ?? FUNDING_RANGES.other;
  const target = input.fundingTarget;

  if (target >= range.min && target <= range.max) {
    return { score: 15, flags };
  }

  if (target < range.min) {
    flags.push("Funding target unusually low for category");
    return { score: 10, flags };
  }

  // Above max
  if (target > range.max * 2) {
    flags.push("Funding target extremely high for category");
    return { score: 3, flags };
  }

  flags.push("Funding target above typical range for category");
  return { score: 7, flags };
}

async function scoreDuplicateCheck(input: CreateProjectInput): Promise<{ score: number; flags: string[] }> {
  const flags: string[] = [];

  try {
    const supabase = getSupabase();
    // Check for projects with very similar names
    const { data } = await supabase
      .from("projects")
      .select("id, name")
      .ilike("name", `%${input.name.trim()}%`);

    const dupes = data?.length ?? 0;

    if (dupes > 0) {
      flags.push(`Similar project name already exists (${dupes} match${dupes > 1 ? "es" : ""})`);
      return { score: dupes > 2 ? 2 : 5, flags };
    }

    return { score: 10, flags };
  } catch {
    return { score: 8, flags };
  }
}

// ── Main scoring function ────────────────────────────────────────────────

export async function scoreProject(
  input: CreateProjectInput,
  creatorWallet: string
): Promise<ScoringResult> {
  const allFlags: string[] = [];

  const desc = scoreDescriptionQuality(input.description);
  const social = scoreSocialProof(input);
  const tokenomics = scoreTokenomicsFlags(input);
  const category = scoreCategoryFit(input);
  const creator = await scoreCreatorHistory(creatorWallet);
  const funding = scoreFundingRealism(input);
  const duplicate = await scoreDuplicateCheck(input);

  allFlags.push(...desc.flags, ...social.flags, ...tokenomics.flags, ...category.flags, ...creator.flags, ...funding.flags, ...duplicate.flags);

  const breakdown: ScoreBreakdown = {
    descriptionQuality: desc.score,
    socialProof: social.score,
    tokenomicsFlags: tokenomics.score,
    categoryFit: category.score,
    creatorHistory: creator.score,
    fundingRealism: funding.score,
    duplicateCheck: duplicate.score,
  };

  const score = Object.values(breakdown).reduce((sum, v) => sum + v, 0);

  return {
    score: Math.min(Math.max(score, 0), 100),
    breakdown,
    riskFlags: allFlags,
  };
}
