import { NextResponse } from "next/server";

const rootUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

const SKILL_MD = `# LaunchForge

## Description
LaunchForge is a crypto project launchpad on Base. It lets you browse, create, and score crypto projects, deploy ERC-20 tokens, and track analytics — all on Base mainnet. Designed for both human users and AI agents.

## Base URL
${rootUrl}

## Authentication
- Most read endpoints are public (no auth required).
- Project creation requires x402 payment ($0.01 USDC on Base).
- Token deployment requires 0.1 USDC on Base (paid via smart contract).

## Endpoints

### GET /api/projects
- **Description:** List all projects with optional filtering, sorting, and search.
- **Inputs:**
  - \`status\` (query, optional): Filter by project status. Values: \`Live\`, \`Upcoming\`, \`Draft\`, \`Ended\`
  - \`category\` (query, optional): Filter by category. Values: \`defi\`, \`nft\`, \`infra\`, \`ai\`, \`social\`, \`gaming\`, \`dao\`, \`other\`
  - \`q\` (query, optional): Full-text search on project name and description
  - \`sort\` (query, optional): Sort order. Values: \`newest\`, \`oldest\`, \`most_funded\`, \`most_liked\`, \`most_viewed\`, \`highest_score\`
  - \`minFunding\` (query, optional): Minimum funding target (number)
  - \`maxFunding\` (query, optional): Maximum funding target (number)
- **Output:** JSON \`{ ok: true, count: number, projects: Project[] }\`
- **Payment:** None (free)

### GET /api/projects/{id}
- **Description:** Get details of a specific project by ID. Also increments view count.
- **Inputs:**
  - \`id\` (path, required): The project ID string
- **Output:** JSON \`{ ok: true, project: Project }\` or \`{ ok: false, error: "Project not found" }\` (404)
- **Payment:** None (free)

### POST /api/projects/create
- **Description:** Create a new project listing. Triggers AI scoring automatically.
- **Inputs (JSON body):**
  - \`name\` (string, required): Project name (min 2 chars)
  - \`description\` (string, required): Project description (min 10 chars)
  - \`creatorWallet\` (string, required): Creator's wallet address
  - \`tokenSymbol\` (string, optional): Token ticker symbol
  - \`category\` (string, optional): One of \`defi\`, \`nft\`, \`infra\`, \`ai\`, \`social\`, \`gaming\`, \`dao\`, \`other\`. Defaults to \`other\`
  - \`website\` (string, optional): Project website URL
  - \`twitter\` (string, optional): Twitter/X URL
  - \`github\` (string, optional): GitHub URL
  - \`fundingTarget\` (number, optional): Funding goal in USDC
  - \`creatorUsername\` (string, optional): Creator's username
  - \`creatorDisplayName\` (string, optional): Creator's display name
  - \`creatorPfpUrl\` (string, optional): Creator's profile picture URL
- **Output:** JSON \`{ ok: true, project: Project }\` (201)
- **Payment:** x402 payment required — $0.01 USDC on Base (eip155:8453). The server responds with 402 and payment instructions. Pay via x402 protocol, then retry with X-PAYMENT header.
- **Side effects:** Creates a project in the database with status "Draft". AI scoring runs asynchronously after creation.

### POST /api/projects/{id}/like
- **Description:** Like a project. One like per wallet (deduplicated).
- **Inputs (JSON body):**
  - \`wallet\` (string, required): The wallet address liking the project
- **Output:** JSON \`{ ok: true }\` or \`{ ok: false, error: "Already liked" }\` (409)
- **Payment:** None (free)
- **Side effects:** Increments the project's like counter.

### GET /api/projects/{id}/like/check
- **Description:** Check if a wallet has already liked a project.
- **Inputs:**
  - \`id\` (path, required): Project ID
  - \`wallet\` (query, required): Wallet address to check
- **Output:** JSON \`{ liked: boolean }\`
- **Payment:** None (free)

### POST /api/projects/{id}/score
- **Description:** Re-run AI scoring analysis for a project.
- **Inputs:**
  - \`id\` (path, required): Project ID
- **Output:** JSON \`{ ok: true, score: number, breakdown: object, riskFlags: string[] }\`
- **Payment:** None (free)
- **Side effects:** Updates the project's AI score and risk flags in the database.

### POST /api/projects/{id}/token
- **Description:** Record a deployed ERC-20 token for a project. Called after on-chain token creation via the LaunchForge Factory contract.
- **Inputs (JSON body):**
  - \`tokenAddress\` (string, required): Deployed token contract address
  - \`txHash\` (string, required): Deployment transaction hash
  - \`wallet\` (string, required): Creator's wallet address
  - \`tokenName\` (string, optional): Token name
  - \`tokenSymbol\` (string, optional): Token symbol
  - \`tokenSupply\` (number, optional): Total token supply
- **Output:** JSON \`{ ok: true, tokenAddress: string }\`
- **Payment:** None (API is free, but the on-chain createToken call costs 0.1 USDC)
- **Side effects:** Updates project status to "Live", records launch transaction.

### GET /api/projects/mine
- **Description:** Get all projects created by a specific wallet.
- **Inputs:**
  - \`wallet\` (query, required): Creator's wallet address (min 10 chars)
- **Output:** JSON \`{ ok: true, projects: Project[] }\`
- **Payment:** None (free)

### GET /api/analytics
- **Description:** Get platform-wide analytics: total projects, live count, views, likes, funding, and top projects.
- **Output:** JSON \`{ ok: true, analytics: { totalProjects, liveProjects, totalViews, totalLikes, totalFunding, topProjects } }\`
- **Payment:** None currently (x402 gate planned)

### POST /api/users/save
- **Description:** Save or update a user profile on wallet connect.
- **Inputs (JSON body):**
  - \`wallet\` (string, required): User's wallet address
  - \`fid\` (number, optional): Farcaster FID
  - \`username\` (string, optional): Username
  - \`displayName\` (string, optional): Display name
  - \`pfpUrl\` (string, optional): Profile picture URL
- **Output:** JSON \`{ ok: true }\`
- **Payment:** None (free)

## Data Types

### Project
\`\`\`json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "creator": "0x... (wallet address)",
  "creatorUsername": "string | null",
  "creatorDisplayName": "string | null",
  "creatorPfpUrl": "string | null",
  "status": "Live | Upcoming | Draft | Ended",
  "tokenSymbol": "string",
  "category": "defi | nft | infra | ai | social | gaming | dao | other",
  "website": "string",
  "twitter": "string",
  "github": "string | null",
  "aiScore": "number (0-100) | null",
  "riskFlags": ["string"],
  "likes": "number",
  "views": "number",
  "createdAt": "ISO 8601 timestamp",
  "fundingTarget": "number | null",
  "fundingRaised": "number",
  "tokenAddress": "0x... | null",
  "tokenTxHash": "0x... | null",
  "tokenSupply": "number | null"
}
\`\`\`

## Smart Contracts (Base Mainnet)

- **LaunchForge Factory:** \`0x4C969A286193e8935d8105D4D970630ae797bA3D\`
  - \`createToken(name, symbol, totalSupply)\` — Deploys ERC-20, costs 0.1 USDC
  - Emits \`TokenCreated(tokenAddress, creator, name, symbol, totalSupply)\`
- **USDC (Base):** \`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\`
- **Treasury:** \`0x01491D527190528ccBC340De80bf2E447dCc4fe3\`

## Error Handling
All endpoints return JSON. Errors include \`{ ok: false, error: "descriptive message" }\` with appropriate HTTP status codes (400, 404, 409, 500).
`;

export async function GET() {
  return new NextResponse(SKILL_MD, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
