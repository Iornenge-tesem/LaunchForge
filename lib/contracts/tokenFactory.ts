/* ── LaunchForge Contract Constants & ABIs ─────────────────────── */

// Base mainnet USDC (6 decimals)
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

// LaunchForge treasury
export const TREASURY_ADDRESS = "0x01491D527190528ccBC340De80bf2E447dCc4fe3" as const;

// Factory address (deployed on Base mainnet)
export const FACTORY_ADDRESS = "0x4C969A286193e8935d8105D4D970630ae797bA3D" as `0x${string}`;

// Launch fee: 0.1 USDC = 100_000 (6 decimals)
export const LAUNCH_FEE = BigInt(100_000);

// Max supply: 10 billion tokens
export const MAX_SUPPLY = BigInt(10_000_000_000);

// ── USDC ERC-20 ABI (only what we need: approve + allowance) ───

export const USDC_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ── LaunchForgeFactory ABI ─────────────────────────────────────

export const FACTORY_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_usdc", type: "address" },
      { internalType: "address", name: "_treasury", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "tokenAddress", type: "address" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "symbol", type: "string" },
      { indexed: false, internalType: "uint256", name: "supply", type: "uint256" },
    ],
    name: "TokenCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "LAUNCH_FEE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint256", name: "_supply", type: "uint256" },
    ],
    name: "createToken",
    outputs: [{ internalType: "address", name: "token", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_creator", type: "address" }],
    name: "creatorTokenCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "deployedTokens",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDeployed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usdc",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
