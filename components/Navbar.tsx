"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/launch", label: "Launch" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(15,15,15,0.88)] backdrop-blur-xl">
      <Container className="flex h-14 items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-[var(--border)]">
            <img
              src="/images/launchforge-icon.png"
              alt="LaunchForge"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="text-sm font-semibold tracking-tight text-[var(--text-main)]">
            LaunchForge
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-[var(--radius-sm)] px-3.5 py-2 text-sm transition-colors ${
                pathname === link.href
                  ? "bg-[var(--accent-muted)] font-medium text-[var(--accent)]"
                  : "text-[var(--text-dim)] hover:bg-[rgba(176,176,176,0.06)] hover:text-[var(--text-main)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Connect Wallet
          </Button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-dim)] transition-colors hover:bg-[rgba(176,176,176,0.06)] hover:text-[var(--text-main)] sm:hidden"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open ? (
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-main)] px-4 pb-5 pt-3 sm:hidden fade-in">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-[var(--radius-sm)] px-3 py-2.5 text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-[var(--accent-muted)] font-medium text-[var(--accent)]"
                    : "text-[var(--text-dim)] hover:text-[var(--text-main)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-[var(--border)] pt-3">
            <Button variant="secondary" size="sm" fullWidth>
              Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
