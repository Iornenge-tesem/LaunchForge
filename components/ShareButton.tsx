"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";

type ShareButtonProps = {
  projectId: string;
  projectName: string;
  /** "icon" = small icon-only button, "full" = button with text */
  variant?: "icon" | "full";
};

const FARCASTER_ICON = (
  <svg width="14" height="14" viewBox="0 0 1000 1000" fill="currentColor">
    <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z" />
    <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" />
    <path d="M693.333 746.667C681.06 746.667 671.111 756.616 671.111 768.889V795.556H666.667C654.394 795.556 644.444 805.505 644.444 817.778V844.444H893.333V817.778C893.333 805.505 883.384 795.556 871.111 795.556H866.667V768.889C866.667 756.616 856.717 746.667 844.444 746.667V351.111H868.889L897.778 253.333H720V746.667H693.333Z" />
  </svg>
);

const X_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function ShareButton({
  projectId,
  projectName,
  variant = "icon",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

  const projectUrl = `${appUrl}/project/${encodeURIComponent(projectId)}`;
  const shareText = `Check out "${projectName}" on LaunchForge 🚀`;

  const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(projectUrl)}`;
  const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(`${shareText}\n${projectUrl}`)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={
          variant === "icon"
            ? "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--text-dim)] transition-all hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)]"
            : "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition-all duration-150 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)]"
        }
        aria-label="Share project"
      >
        <Share2 size={variant === "icon" ? 14 : 16} />
        {variant === "full" && "Share"}
      </button>

      {open && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5 shadow-[var(--shadow-lg)] sm:right-0 sm:left-auto left-0">
            <a
              href={farcasterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-main)] transition-colors hover:bg-[var(--bg-elevated)]"
            >
              {FARCASTER_ICON}
              Cast on Farcaster
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-main)] transition-colors hover:bg-[var(--bg-elevated)]"
            >
              {X_ICON}
              Post on X
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                copyLink();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-main)] transition-colors hover:bg-[var(--bg-elevated)]"
            >
              {copied ? (
                <Check size={14} className="text-[var(--green)]" />
              ) : (
                <Link2 size={14} />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
