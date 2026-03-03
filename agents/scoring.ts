/**
 * LaunchForge AI Scoring Agent
 *
 * Analyzes project submissions automatically and produces:
 *   - Score (0–100)
 *   - Summary text
 *   - Risk flags
 *   - Reputation check data
 *
 * In production, these run as background jobs triggered
 * after project creation via /api/projects/create.
 */

import type { AIScoreResult, LaunchProject } from "@/lib/types";

/**
 * Analyze a project and produce an AI score.
 *
 * In production this would:
 *   1. Check wallet history on Base (age, tx count, prior deploys)
 *   2. Analyze tokenomics for red flags (high team allocation, no vesting, etc.)
 *   3. Verify social links (is Twitter active? Does GitHub have real code?)
 *   4. Cross-reference with known scam patterns
 *   5. Aggregate community signals
 */
export async function analyzeProject(
  project: LaunchProject
): Promise<AIScoreResult> {
  // ── Reputation Check (placeholder) ────────────────────────
  const reputationCheck = await checkWalletReputation(project.creator);

  // ── Risk Analysis ─────────────────────────────────────────
  const riskFlags: string[] = [];

  // Check for missing key info
  if (!project.website) riskFlags.push("no-website");
  if (!project.github) riskFlags.push("no-source-code");
  if (!project.tokenSymbol) riskFlags.push("no-token");

  // Check for tokenomics red flags
  if (project.fundingTarget && project.fundingTarget > 100000) {
    riskFlags.push("high-funding-target");
  }

  // ── Score Calculation ─────────────────────────────────────
  let score = 50; // Base score

  // Reputation bonus
  if (reputationCheck.trustLevel === "high") score += 25;
  else if (reputationCheck.trustLevel === "medium") score += 15;
  else if (reputationCheck.trustLevel === "low") score += 5;

  // Completeness bonus
  if (project.website) score += 5;
  if (project.github) score += 10;
  if (project.twitter) score += 5;
  if (project.description.length > 100) score += 5;

  // Risk penalties
  score -= riskFlags.length * 5;

  // Clamp
  score = Math.max(0, Math.min(100, score));

  // ── Summary Generation ────────────────────────────────────
  const summary = generateSummary(project, score, riskFlags, reputationCheck);

  return {
    score,
    summary,
    riskFlags,
    reputationCheck,
  };
}

/**
 * Check wallet reputation on Base.
 *
 * In production, this queries onchain data:
 *   - Wallet age
 *   - Transaction count
 *   - Prior contract deployments
 *   - Interaction with known protocols
 */
async function checkWalletReputation(
  walletAddress: string
): Promise<AIScoreResult["reputationCheck"]> {
  // TODO: implement with Base RPC / indexer
  // Example:
  // const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
  // const txCount = await provider.getTransactionCount(walletAddress);
  // const walletAge = await getWalletAge(walletAddress);

  return {
    walletAge: "Unknown",
    priorProjects: 0,
    trustLevel: "unknown",
  };
}

/**
 * Generate a human-readable summary of the analysis.
 */
function generateSummary(
  project: LaunchProject,
  score: number,
  riskFlags: string[],
  reputation: AIScoreResult["reputationCheck"]
): string {
  const grade =
    score >= 80
      ? "Strong"
      : score >= 60
        ? "Moderate"
        : score >= 40
          ? "Low"
          : "Very Low";

  let summary = `${project.name} has a ${grade} confidence score of ${score}/100. `;

  if (reputation.trustLevel === "high") {
    summary += "The creator wallet has a strong onchain reputation. ";
  } else if (reputation.trustLevel === "unknown") {
    summary += "The creator wallet reputation could not be verified. ";
  }

  if (riskFlags.length === 0) {
    summary += "No risk flags were detected.";
  } else {
    summary += `${riskFlags.length} risk flag(s) detected: ${riskFlags.join(", ")}.`;
  }

  return summary;
}

/**
 * Batch analyze all unscored projects.
 * Run this as a cron job or background task.
 */
export async function batchAnalyze(
  projects: LaunchProject[]
): Promise<Map<string, AIScoreResult>> {
  const results = new Map<string, AIScoreResult>();

  for (const project of projects) {
    if (project.aiScore === undefined) {
      const result = await analyzeProject(project);
      results.set(project.id, result);
    }
  }

  return results;
}
