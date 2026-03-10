/**
 * Deploy LaunchForgeFactory using viem (bypasses Hardhat networking issues).
 *
 * Usage: node scripts/deploy-viem.mjs
 *
 * Requires: DEPLOYER_PRIVATE_KEY in .env
 */
import { createWalletClient, createPublicClient, http, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { readFileSync } from "fs";
import { config } from "dotenv";

config(); // load .env

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const TREASURY_ADDRESS = "0x01491D527190528ccBC340De80bf2E447dCc4fe3";

const base = defineChain({
  id: 8453,
  name: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://basescan.org" },
  },
});

async function main() {
  const key = process.env.DEPLOYER_PRIVATE_KEY;
  if (!key) throw new Error("DEPLOYER_PRIVATE_KEY not set in .env");

  const account = privateKeyToAccount(key.startsWith("0x") ? key : `0x${key}`);
  console.log("Deployer:", account.address);

  const transport = http("https://mainnet.base.org", {
    timeout: 60_000,
    retryCount: 3,
    retryDelay: 2000,
  });

  const publicClient = createPublicClient({ chain: base, transport });
  const walletClient = createWalletClient({ chain: base, transport, account });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log("Balance:", Number(balance) / 1e18, "ETH");

  if (balance === 0n) throw new Error("No ETH for gas — fund the deployer wallet first");

  // Load compiled artifact
  const artifact = JSON.parse(
    readFileSync("./artifacts/contracts/LaunchForgeFactory.sol/LaunchForgeFactory.json", "utf8")
  );

  console.log("Deploying LaunchForgeFactory...");
  console.log("  USDC:", USDC_ADDRESS);
  console.log("  Treasury:", TREASURY_ADDRESS);

  // Encode constructor args: (address _usdc, address _treasury)
  const { encodeAbiParameters, parseAbiParameters } = await import("viem");
  const encodedArgs = encodeAbiParameters(
    parseAbiParameters("address, address"),
    [USDC_ADDRESS, TREASURY_ADDRESS]
  );

  const deployData = artifact.bytecode + encodedArgs.slice(2); // remove 0x from args

  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: [USDC_ADDRESS, TREASURY_ADDRESS],
  });

  console.log("Tx hash:", hash);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("\n✅ LaunchForgeFactory deployed!");
  console.log("   Address:", receipt.contractAddress);
  console.log("   Block:", receipt.blockNumber);
  console.log("   Gas used:", receipt.gasUsed.toString());
  console.log("\nUpdate FACTORY_ADDRESS in lib/contracts/tokenFactory.ts to:", receipt.contractAddress);
}

main().catch((err) => {
  console.error("Deploy failed:", err.message || err);
  process.exit(1);
});
