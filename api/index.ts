/**
 * LaunchForge API Module
 *
 * All API routes are handled by Next.js App Router at /app/api/.
 *
 * Endpoints:
 *   GET  /api/projects          — List all projects (filterable)
 *   GET  /api/projects/:id      — Get project detail
 *   POST /api/projects/create   — Create new project ($0.01 USDC via x402)
 *   GET  /api/analytics         — Platform analytics ($0.001 USDC via x402)
 *   POST /api/webhook           — MiniKit webhook handler
 *
 * x402 Integration:
 *   Paid endpoints return 402 Payment Required if no X-PAYMENT header.
 *   Client sends EIP-712 signed USDC payment in header.
 *   Server verifies via facilitator, then proceeds.
 */

export const API_VERSION = "v1";
