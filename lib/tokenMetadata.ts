import { base } from "viem/chains";
import {
  createPublicClient,
  http,
  isAddress,
  type Address,
  type PublicClient,
} from "viem";

export type TokenProjectMetadata = {
  tokenAddress: Address;
  tokenName: string;
  tokenSymbol: string;
  description: string;
  imageUrl: string;
  websiteUrl?: string;
  metadataUri: string;
  metadataJsonUrl: string;
  raw: Record<string, unknown>;
};

const ERC20_METADATA_ABI = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "contractURI",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
] as const;

function getBaseRpcUrl() {
  return process.env.BASE_RPC_URL || "https://mainnet.base.org";
}

export function resolveMetadataUri(uri: string): string {
  if (!uri) return uri;

  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`;
  }

  if (uri.startsWith("ar://")) {
    return `https://arweave.net/${uri.replace("ar://", "")}`;
  }

  return uri;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function getImageUrl(metadata: Record<string, unknown>): string {
  const imageCandidate =
    asString(metadata.image) ||
    asString(metadata.image_url) ||
    asString(metadata.logo) ||
    asString(metadata.icon);

  if (!imageCandidate) return "";
  return resolveMetadataUri(imageCandidate);
}

export function getWebsiteUrl(metadata: Record<string, unknown>): string | undefined {
  const websiteCandidate =
    asString(metadata.website) ||
    asString(metadata.external_url) ||
    asString(metadata.homepage);

  if (!websiteCandidate) return undefined;
  return resolveMetadataUri(websiteCandidate);
}

async function readOptionalString(
  client: PublicClient,
  tokenAddress: Address,
  functionName: "name" | "symbol" | "tokenURI" | "contractURI"
): Promise<string | null> {
  try {
    const value = await client.readContract({
      address: tokenAddress,
      abi: ERC20_METADATA_ABI,
      functionName,
    });

    return typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : null;
  } catch {
    return null;
  }
}

export async function fetchTokenProjectMetadata(
  tokenAddressInput: string
): Promise<TokenProjectMetadata> {
  if (!isAddress(tokenAddressInput)) {
    throw new Error("Invalid token address");
  }

  const tokenAddress = tokenAddressInput as Address;
  const client = createPublicClient({
    chain: base,
    transport: http(getBaseRpcUrl()),
  });

  const [name, symbol, tokenUri, contractUri] = await Promise.all([
    readOptionalString(client, tokenAddress, "name"),
    readOptionalString(client, tokenAddress, "symbol"),
    readOptionalString(client, tokenAddress, "tokenURI"),
    readOptionalString(client, tokenAddress, "contractURI"),
  ]);

  const metadataUri = tokenUri || contractUri;
  if (!metadataUri) {
    throw new Error(
      "This token contract does not expose tokenURI() or contractURI()."
    );
  }

  const metadataJsonUrl = resolveMetadataUri(metadataUri);
  const response = await fetch(metadataJsonUrl, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Metadata fetch failed (${response.status})`);
  }

  const json = (await response.json()) as Record<string, unknown>;
  const tokenName =
    asString(json.name) || name || `Token ${tokenAddress.slice(0, 6)}`;
  const tokenSymbol = asString(json.symbol) || symbol || "TOKEN";
  const description =
    asString(json.description) || "No project description provided.";
  const imageUrl = getImageUrl(json);
  const websiteUrl = getWebsiteUrl(json);

  return {
    tokenAddress,
    tokenName,
    tokenSymbol,
    description,
    imageUrl,
    websiteUrl,
    metadataUri,
    metadataJsonUrl,
    raw: json,
  };
}
