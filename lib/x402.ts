/**
 * x402 Micro-Payment Utilities for LaunchForge
 *
 * Integrates @x402/core, @x402/express, @x402/evm for
 * USDC micro-payments on Base.
 *
 * Endpoints that require payment:
 *   /api/projects/create  → $0.01 USDC
 *   /api/analytics/fetch  → $0.001 USDC
 *
 * Payment flow:
 *   1. Client makes request without payment → 402 Payment Required
 *   2. Client signs EIP-712 payment and sends in X-PAYMENT header
 *   3. Server verifies payment via facilitator
 *   4. Request proceeds if valid
 *   5. USDC settled to payTo wallet on Base
 *
 * Install dependencies:
 *   npm install @x402/core @x402/express @x402/evm
 */

import { CHAINS, PAYMENT } from "@/lib/constants";

/** Wallet address to receive payments */
export const PAY_TO_ADDRESS =
  process.env.X402_PAY_TO_ADDRESS ?? "0x0000000000000000000000000000000000000000";

/** Current chain (toggle testnet/mainnet via env) */
export const CHAIN_ID =
  process.env.NEXT_PUBLIC_CHAIN_ENV === "mainnet"
    ? CHAINS.BASE_MAINNET
    : CHAINS.BASE_TESTNET;

/**
 * Verify an x402 payment header.
 *
 * In production, this calls the x402 facilitator to validate
 * the EIP-712 signed USDC payment.
 *
 * @param paymentHeader - The raw X-PAYMENT header value
 * @param requiredAmount - Amount in USDC (e.g. 0.01)
 * @returns true if valid, false otherwise
 */
export async function verifyPayment(
  paymentHeader: string,
  requiredAmount: number
): Promise<boolean> {
  // TODO: implement with @x402/core
  //
  // Example integration:
  // import { x402 } from "@x402/core";
  // import { baseSepolia } from "@x402/evm/chains";
  //
  // const result = await x402.verifyPayment({
  //   paymentHeader,
  //   payTo: PAY_TO_ADDRESS,
  //   amount: requiredAmount,
  //   chainId: CHAIN_ID,
  // });
  //
  // return result.isValid;

  console.log("[x402] Payment verification placeholder", {
    requiredAmount,
    chainId: CHAIN_ID,
  });

  return true; // Placeholder — always passes in dev
}

/**
 * Generate a 402 Payment Required response.
 *
 * Returns the response clients need to know how much to pay
 * and where to send payment.
 */
export function createPaymentRequiredResponse(endpoint: string) {
  const amount =
    endpoint === "/api/projects/create"
      ? PAYMENT.PROJECT_CREATE
      : PAYMENT.ANALYTICS_FETCH;

  return {
    status: 402,
    body: {
      ok: false,
      error: "Payment Required",
      payment: {
        amount,
        currency: "USDC",
        chain: CHAIN_ID,
        payTo: PAY_TO_ADDRESS,
        protocol: "x402",
      },
    },
  };
}
