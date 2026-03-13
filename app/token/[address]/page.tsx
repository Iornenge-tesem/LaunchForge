import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAddress } from "viem";
import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchTokenProjectMetadata } from "@/lib/tokenMetadata";
import { ArrowLeft, ExternalLink, Globe, FileJson } from "lucide-react";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

type PageProps = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = await params;

  if (!isAddress(address)) {
    return {
      title: "Invalid token address | LaunchForge",
      description: "The token address is invalid.",
    };
  }

  try {
    const metadata = await fetchTokenProjectMetadata(address);
    const url = `${appUrl}/token/${address}`;

    return {
      title: `${metadata.tokenName} (${metadata.tokenSymbol}) | LaunchForge`,
      description: metadata.description.slice(0, 160),
      openGraph: {
        title: `${metadata.tokenName} (${metadata.tokenSymbol})`,
        description: metadata.description.slice(0, 200),
        url,
        siteName: "LaunchForge",
        type: "website",
        images: metadata.imageUrl
          ? [
              {
                url: metadata.imageUrl,
                width: 1200,
                height: 630,
                alt: `${metadata.tokenName} icon`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${metadata.tokenName} (${metadata.tokenSymbol})`,
        description: metadata.description.slice(0, 200),
        images: metadata.imageUrl ? [metadata.imageUrl] : undefined,
      },
    };
  } catch {
    return {
      title: "Token metadata unavailable | LaunchForge",
      description: "Unable to resolve token metadata for this address.",
    };
  }
}

export default async function TokenProfilePage({ params }: PageProps) {
  const { address } = await params;

  if (!isAddress(address)) {
    notFound();
  }

  let metadata;
  try {
    metadata = await fetchTokenProjectMetadata(address);
  } catch {
    notFound();
  }

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Link
          href="/launch"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft size={16} />
          Back to Launch
        </Link>

        <Card padding="lg" className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
              {metadata.imageUrl ? (
                <img
                  src={metadata.imageUrl}
                  alt={`${metadata.tokenName} icon`}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
                  {metadata.tokenName}
                </h1>
                <Badge variant="default">${metadata.tokenSymbol}</Badge>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                {metadata.description}
              </p>

              <p className="mt-3 text-xs text-[var(--text-dim)]">
                Token address: {metadata.tokenAddress}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {metadata.websiteUrl && (
              <a
                href={metadata.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-main)] hover:border-[var(--border-hover)]"
              >
                <Globe size={14} />
                Website
                <ExternalLink size={13} />
              </a>
            )}
            <a
              href={metadata.metadataJsonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-main)] hover:border-[var(--border-hover)]"
            >
              <FileJson size={14} />
              Metadata JSON
              <ExternalLink size={13} />
            </a>
            <a
              href={`https://basescan.org/token/${metadata.tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-main)] hover:border-[var(--border-hover)]"
            >
              View on BaseScan
              <ExternalLink size={13} />
            </a>
          </div>
        </Card>
      </Container>
    </section>
  );
}
