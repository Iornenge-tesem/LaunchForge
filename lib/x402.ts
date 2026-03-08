/**
 * x402 Payment Configuration for LaunchForge
 *
 * Uses @x402/next + @x402/evm for USDC micro-payments on Base mainnet.
 * The Coinbase facilitator handles payment verification & settlement.
 *
 * Endpoints that require payment:
 *   /api/projects/create  → $0.01 USDC
 */

import { PAYMENT } from "@/lib/constants";
import { withX402 } from "@x402/next";
import { x402ResourceServer } from "@x402/next";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import type { RouteConfig } from "@x402/next";
import type { NextRequest, NextResponse } from "next/server";

/** Treasury wallet — receives all x402 payments */
export const PAY_TO_ADDRESS =
  "0x01491D527190528ccBC340De80bf2E447dCc4fe3" as `0x${string}`;

/** Base mainnet network identifier */
const NETWORK = "eip155:8453" as const;

/** x402 resource server (uses Coinbase public facilitator by default) */
const server = new x402ResourceServer().register(
  NETWORK,
  new ExactEvmScheme()
);

/** Route config for project creation — $0.01 USDC */
export const projectCreateRouteConfig: RouteConfig = {
  accepts: {
    scheme: "exact",
    network: NETWORK,
    payTo: PAY_TO_ADDRESS,
    price: `$${PAYMENT.PROJECT_CREATE}`,
  },
  description: "Create a LaunchForge project listing",
};

/**
 * Wraps a Next.js route handler with x402 payment protection.
 * Payment is only settled after the handler returns a successful response.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withPaymentGate(
  handler: (request: NextRequest) => Promise<NextResponse<any>>,
  routeConfig: RouteConfig = projectCreateRouteConfig
) {
  return withX402(handler, routeConfig, server);
}
