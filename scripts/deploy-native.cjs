/**
 * Deploy LaunchForgeFactory using Node.js native https module.
 * Forces IPv4 to bypass Node.js v23 IPv6/undici connectivity issues.
 *
 * Usage: node scripts/deploy-native.cjs
 */
const https = require("https");
const dns = require("dns");
const fs = require("fs");

// Load .env manually
const envContent = fs.readFileSync(".env", "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const PRIVATE_KEY = envVars.DEPLOYER_PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("DEPLOYER_PRIVATE_KEY not found in .env");
  process.exit(1);
}

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const TREASURY = "0x01491D527190528ccBC340De80bf2E447dCc4fe3";
const RPC_HOST = "mainnet.base.org";

// Resolve IPv4 address once up front
let IPV4_ADDRESS = null;

function resolveIPv4() {
  return new Promise((resolve, reject) => {
    dns.resolve4(RPC_HOST, (err, addrs) => {
      if (err || !addrs.length) reject(err || new Error("No IPv4 address"));
      else resolve(addrs[0]);
    });
  });
}

let rpcId = 1;
function rpcCall(method, params) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ jsonrpc: "2.0", method, params, id: rpcId++ });
    const req = https.request(
      {
        hostname: IPV4_ADDRESS,
        path: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Host: RPC_HOST,
        },
        servername: RPC_HOST, // for TLS SNI
        timeout: 60000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.error) reject(new Error(JSON.stringify(json.error)));
            else resolve(json.result);
          } catch (e) {
            reject(new Error("Invalid JSON: " + data.slice(0, 200)));
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    req.write(body);
    req.end();
  });
}

async function main() {
  // Resolve IPv4 first
  IPV4_ADDRESS = await resolveIPv4();
  console.log("Using IPv4:", IPV4_ADDRESS);

  // Verify RPC connectivity
  const blockNum = await rpcCall("eth_blockNumber", []);
  console.log("Connected to Base, block:", parseInt(blockNum, 16));

  const { ethers } = require("ethers");

  // Custom provider that uses our IPv4-forced RPC
  class IPv4Provider extends ethers.JsonRpcProvider {
    constructor() {
      super("https://" + RPC_HOST, { chainId: 8453, name: "base" }, { staticNetwork: true });
    }

    async _send(payload) {
      const payloads = Array.isArray(payload) ? payload : [payload];
      const results = [];

      for (const p of payloads) {
        try {
          const result = await rpcCall(p.method, p.params);
          results.push({ id: p.id, result });
        } catch (err) {
          // ethers expects error in specific format
          results.push({
            id: p.id,
            error: { code: -32000, message: err.message },
          });
        }
      }
      return results;
    }
  }

  const provider = new IPv4Provider();
  const wallet = new ethers.Wallet(
    PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : "0x" + PRIVATE_KEY,
    provider
  );

  console.log("Deployer:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("\n❌ No ETH — fund your deployer wallet first");
    console.error("   Send Base ETH to:", wallet.address);
    process.exit(1);
  }

  const artifact = JSON.parse(
    fs.readFileSync(
      "./artifacts/contracts/LaunchForgeFactory.sol/LaunchForgeFactory.json",
      "utf8"
    )
  );

  console.log("\nDeploying LaunchForgeFactory...");
  console.log("  USDC:", USDC_ADDRESS);
  console.log("  Treasury:", TREASURY);

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  const contract = await factory.deploy(USDC_ADDRESS, TREASURY);
  console.log("Tx hash:", contract.deploymentTransaction().hash);
  console.log("Waiting for confirmation...");

  await contract.waitForDeployment();
  const addr = await contract.getAddress();

  console.log("\n✅ LaunchForgeFactory deployed!");
  console.log("   Address:", addr);
  console.log(
    "\nUpdate FACTORY_ADDRESS in lib/contracts/tokenFactory.ts to:",
    addr
  );
}

main().catch((err) => {
  console.error("Deploy failed:", err.message || err);
  process.exit(1);
});
