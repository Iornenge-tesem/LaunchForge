import { NextResponse } from "next/server";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

/**
 * GET /api/agent
 *
 * Serves ERC-8004 compatible agent metadata for on-chain registration.
 * AI agents and registries can discover LaunchForge capabilities via this endpoint.
 *
 * ERC-8004 is the Agent Registry Standard co-authored by Coinbase, Google,
 * MetaMask, and the Ethereum Foundation.
 *
 * On-chain registration: run `npm run register:agent` to register this
 * metadata URI in the Base agent registry contract.
 */
export async function GET() {
  const metadata = {
    // ERC-8004 agent identity fields
    name: "LaunchForge",
    version: "1.0.0",
    description:
      "A crypto project launchpad on Base. Browse, create, and score crypto projects. Deploy ERC-20 tokens. Track analytics. Designed for both human users and AI agents.",
    url: appUrl,
    iconUrl: `${appUrl}/images/launchforge-icon.png`,

    // Supported chain(s)
    chains: [
      {
        chainId: 8453,
        name: "Base",
        nativeCurrency: "ETH",
      },
    ],

    // Authentication methods
    auth: {
      human: "No auth required for read. x402 USDC payment for write actions.",
      agent: {
        type: "fishnet",
        endpoint: `${appUrl}/api/agent-auth`,
        description:
          "AI agents authenticate via Fishnet (reverse CAPTCHA). Prove LLM-level reasoning to receive credentials.",
      },
    },

    // Discoverable capabilities
    capabilities: [
      {
        name: "list_projects",
        description:
          "Browse all crypto projects on the platform with filtering and search",
        endpoint: `${appUrl}/api/projects`,
        method: "GET",
        params: ["status", "category", "q", "sort", "minFunding", "maxFunding"],
        auth: "none",
      },
      {
        name: "get_project",
        description: "Get full details for a specific project by ID",
        endpoint: `${appUrl}/api/projects/{id}`,
        method: "GET",
        auth: "none",
      },
      {
        name: "create_project",
        description:
          "Create a new crypto project. Requires x402 payment of $0.01 USDC on Base.",
        endpoint: `${appUrl}/api/projects/create`,
        method: "POST",
        auth: "x402_usdc",
        cost: { amount: "0.01", currency: "USDC", chain: "base" },
      },
      {
        name: "get_analytics",
        description:
          "Get platform-wide analytics. Requires Fishnet agent authentication.",
        endpoint: `${appUrl}/api/analytics`,
        method: "GET",
        auth: "fishnet",
      },
    ],

    // x402 payment info for agent-initiated actions
    payments: {
      protocol: "x402",
      network: "base",
      tokens: [
        {
          symbol: "USDC",
          address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
          decimals: 6,
        },
      ],
    },

    // ERC-8004 registry metadata
    registry: {
      standard: "ERC-8004",
      network: "base",
      contractAddress: "0x0000000000000000000000000000000000000000", // replace after registration
      registrationTx: null, // set after on-chain registration
    },
  };

  return NextResponse.json(metadata, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
