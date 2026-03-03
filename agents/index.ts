/**
 * LaunchForge AI Agents
 *
 * /agents folder contains AI analysis scripts that run
 * automatically on project submissions.
 *
 * Available agents:
 *   - scoring.ts    — Project scoring, risk analysis, reputation check
 *   - (future) market.ts — Market condition analysis
 *   - (future) social.ts — Social signal aggregation
 */

export { analyzeProject, batchAnalyze } from "./scoring";
