/**
 * LaunchForge Smart Contracts
 *
 * /contracts folder contains ABIs, addresses, and helpers
 * for onchain interactions.
 *
 * Planned contracts:
 *   - TokenFactory:   Deploy ERC-20 tokens with customizable params
 *   - LiquidityLock:  Lock LP tokens for a set period
 *   - AntiSnipe:      Anti-bot mechanics for fair launches
 *   - VestingVault:   Token vesting with cliff and linear schedules
 *
 * Anti-rug features:
 *   - Whitelisting
 *   - Vesting schedules
 *   - Screenshot verification
 *   - LP lock requirements
 *
 * Deployment:
 *   Use Hardhat or Foundry scripts.
 *   See /contracts/deploy/ for deployment helpers.
 */

/** Contract addresses (populated after deployment) */
export const CONTRACT_ADDRESSES = {
  tokenFactory: {
    mainnet: "", // eip155:8453
    testnet: "", // eip155:84532
  },
  liquidityLock: {
    mainnet: "",
    testnet: "",
  },
  vestingVault: {
    mainnet: "",
    testnet: "",
  },
} as const;

/** Minimal ERC-20 ABI for token interactions */
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
] as const;

/** TokenFactory ABI (placeholder — update after deployment) */
export const TOKEN_FACTORY_ABI = [
  "function createToken(string name, string symbol, uint256 totalSupply, address owner) returns (address)",
  "function getTokensByOwner(address owner) view returns (address[])",
  "event TokenCreated(address indexed token, address indexed owner, string name, string symbol)",
] as const;

/** LiquidityLock ABI (placeholder) */
export const LIQUIDITY_LOCK_ABI = [
  "function lockLiquidity(address token, uint256 amount, uint256 unlockTime) returns (uint256 lockId)",
  "function unlock(uint256 lockId)",
  "function getLock(uint256 lockId) view returns (address token, uint256 amount, uint256 unlockTime, address owner)",
  "event LiquidityLocked(uint256 indexed lockId, address indexed token, uint256 amount, uint256 unlockTime)",
] as const;
