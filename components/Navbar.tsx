"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/Container";
import { useTheme, useMiniAppProfile } from "@/components/providers";
import { Sun, Moon, ChevronDown, ChevronUp, Wallet } from "lucide-react";
import { CreatorIdentity } from "@/components/CreatorIdentity";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/launch", label: "Launch" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { user, address, isConnected } = useMiniAppProfile();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Base Account";
  const profileName = user?.displayName || user?.username || shortAddress;

  const profileAvatar = user?.pfpUrl ? (
    <img
      src={user.pfpUrl}
      alt={profileName}
      className="h-8 w-8 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
      <Wallet size={14} />
    </span>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-main)]/95 backdrop-blur-xl dark:bg-[var(--bg-main)]/95">
      <Container className="flex h-16 items-center gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] shadow-[var(--shadow-xs)]">
            <img
              src="/images/launchforge-icon.png"
              alt="LaunchForge"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="text-sm font-bold tracking-tight text-[var(--text-main)] sm:text-[15px]">
            LaunchForge
          </span>
        </Link>

        {/* Center Nav (desktop) */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                pathname === link.href
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 transition-all duration-150 hover:border-[var(--border-hover)] sm:hidden"
            aria-label="Open navigation menu"
            aria-expanded={open}
          >
            {address ? (
              <div className="max-w-[120px] truncate">
                <CreatorIdentity
                  address={address}
                  displayName={user?.displayName ?? undefined}
                  username={user?.username ?? undefined}
                  pfpUrl={user?.pfpUrl ?? undefined}
                  size="sm"
                />
              </div>
            ) : (
              <>
                {profileAvatar}
                <div className="min-w-0 leading-tight">
                  <p className="max-w-[90px] truncate text-xs font-semibold text-[var(--text-main)]">
                    {profileName}
                  </p>
                </div>
              </>
            )}
            {open ? (
              <ChevronUp size={16} className="shrink-0 text-[var(--text-dim)]" />
            ) : (
              <ChevronDown size={16} className="shrink-0 text-[var(--text-dim)]" />
            )}
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 sm:flex">
            {address ? (
              <div className="min-w-0 leading-tight">
                <div className="max-w-[160px] truncate">
                  <CreatorIdentity
                    address={address}
                    displayName={user?.displayName ?? undefined}
                    username={user?.username ?? undefined}
                    pfpUrl={user?.pfpUrl ?? undefined}
                    size="md"
                  />
                </div>
                <p className="max-w-[160px] truncate text-[11px] text-[var(--text-dim)]">
                  {isConnected ? shortAddress : "Auto-connecting..."}
                </p>
              </div>
            ) : (
              <>
                {profileAvatar}
                <div className="min-w-0 leading-tight">
                  <p className="max-w-[140px] truncate text-xs font-semibold text-[var(--text-main)]">
                    {profileName}
                  </p>
                  <p className="max-w-[140px] truncate text-[11px] text-[var(--text-dim)]">
                    {isConnected ? shortAddress : "Auto-connecting..."}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)] sm:flex"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

        </div>
      </Container>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-card)] px-5 pb-4 pt-2.5 shadow-[var(--shadow-lg)] sm:hidden slide-in-down">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                  pathname === link.href
                    ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-[var(--border)] pt-3">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm font-medium text-[var(--text-main)] transition-all duration-150 hover:bg-[var(--bg-main)]"
              aria-label="Toggle theme"
            >
              <span>Theme</span>
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
