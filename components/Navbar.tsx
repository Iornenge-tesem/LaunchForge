"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/Container";
import { useTheme, useMiniAppProfile } from "@/components/providers";
import { Sun, Moon, Menu, X, Wallet } from "lucide-react";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/launch", label: "Launch" },
  { href: "#", label: "Docs" },
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
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[5px] border border-[var(--border)] shadow-[var(--shadow-xs)]">
            <img
              src="/images/launchforge-icon.png"
              alt="LaunchForge"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="text-base font-bold tracking-tight text-[var(--text-main)]">
            LaunchForge
          </span>
        </Link>

        {/* Center Nav (desktop) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-[5px] px-4 py-2 text-sm font-medium transition-all duration-150 ${
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-[5px] border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 sm:hidden">
            {profileAvatar}
            <div className="min-w-0 leading-tight">
              <p className="max-w-[90px] truncate text-xs font-semibold text-[var(--text-main)]">
                {profileName}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-[5px] border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 sm:flex">
            {profileAvatar}
            <div className="min-w-0 leading-tight">
              <p className="max-w-[140px] truncate text-xs font-semibold text-[var(--text-main)]">
                {profileName}
              </p>
              <p className="max-w-[140px] truncate text-[11px] text-[var(--text-dim)]">
                {isConnected ? shortAddress : "Auto-connecting..."}
              </p>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-[5px] text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)] sm:flex"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[5px] text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)] sm:hidden"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-card)] px-5 pb-6 pt-4 shadow-[var(--shadow-lg)] sm:hidden slide-in-down">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-[5px] px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  pathname === link.href
                    ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-[5px] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--text-main)] transition-all duration-150 hover:bg-[var(--bg-main)]"
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
