const hre = require("hardhat");

/**
 * Deploy LaunchForgeFactory to Base mainnet.
 *
 * Usage:
 *   npx hardhat run scripts/deploy.cjs --network base
 *
 * Required env vars:
 *   DEPLOYER_PRIVATE_KEY — private key of deployer wallet (needs Base ETH for gas)
 */
async function main() {
  const ethers = hre.ethers;

  // Base mainnet USDC
  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  // LaunchForge treasury wallet
  const TREASURY_ADDRESS = "0x01491D527190528ccBC340De80bf2E447dCc4fe3";

  console.log("Deploying LaunchForgeFactory...");
  console.log("  USDC:     " + USDC_ADDRESS);
  console.log("  Treasury: " + TREASURY_ADDRESS);

  const [deployer] = await ethers.getSigners();
  console.log("  Deployer: " + deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("  Balance:  " + ethers.formatEther(balance) + " ETH");

  const Factory = await ethers.getContractFactory("LaunchForgeFactory");
  const factory = await Factory.deploy(USDC_ADDRESS, TREASURY_ADDRESS);

  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("\n✅ LaunchForgeFactory deployed!");
  console.log("   Address: " + factoryAddress);
  console.log("\nAdd to your .env:");
  console.log("   NEXT_PUBLIC_FACTORY_ADDRESS=" + factoryAddress);
}

main().catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});
