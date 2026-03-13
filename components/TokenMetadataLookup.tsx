"use client";

import { useMemo, useState } from "react";
import { isAddress } from "viem";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Search,
  Globe,
  Image as ImageIcon,
  FileJson,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

type TokenMetadataResponse = {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  description: string;
  imageUrl: string;
  websiteUrl?: string;
  metadataUri: string;
  metadataJsonUrl: string;
};

export function TokenMetadataLookup() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TokenMetadataResponse | null>(null);

  const canLookup = useMemo(() => isAddress(tokenAddress.trim()), [tokenAddress]);

  async function handleLookup() {
    if (!canLookup || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/token-metadata?address=${encodeURIComponent(tokenAddress.trim())}`,
        { cache: "no-store" }
      );
      const json = await response.json();

      if (!response.ok || !json.ok || !json.metadata) {
        throw new Error(json.error || "Unable to fetch token metadata");
      }

      setData(json.metadata as TokenMetadataResponse);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card padding="lg" className="border-[var(--accent-border-soft)]/60">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="rounded-xl bg-[var(--accent-muted)] p-2 text-[var(--accent)]">
          <Search size={16} />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          Verify ERC-20 Metadata
        </h2>
      </div>

      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Paste a Base token address to read tokenURI or contractURI metadata and preview how your project identity appears.
      </p>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          label="Token Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="0x..."
          hint="This reads contract metadata using a public Base RPC on the server"
        />
        <div className="sm:self-end">
          <Button
            type="button"
            onClick={handleLookup}
            disabled={!canLookup || loading}
            className="min-h-[44px] w-full sm:w-auto"
          >
            {loading ? "Fetching..." : "Fetch Metadata"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--red-border-soft)] bg-[var(--red-muted)] p-3 text-sm text-[var(--red)]">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={`${data.tokenName} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[var(--text-dim)]">
                  <ImageIcon size={20} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-lg font-semibold text-[var(--text-main)]">
                  {data.tokenName}
                </h3>
                <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                  ${data.tokenSymbol}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {data.description}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {data.websiteUrl && (
              <a
                href={data.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-main)] hover:border-[var(--border-hover)]"
              >
                <Globe size={14} />
                Website
                <ExternalLink size={13} />
              </a>
            )}
            <a
              href={data.metadataJsonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-main)] hover:border-[var(--border-hover)]"
            >
              <FileJson size={14} />
              Metadata JSON
              <ExternalLink size={13} />
            </a>
          </div>

          <a
            href={`/token/${data.tokenAddress}`}
            className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[var(--accent-border-soft)] bg-[var(--accent-muted)] px-3 py-2 text-xs font-semibold text-[var(--accent)]"
          >
            Open shareable token profile page
          </a>
        </div>
      )}
    </Card>
  );
}
