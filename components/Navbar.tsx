"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/providers";
import { Sun, Moon, Menu, X, Wallet } from "lucide-react";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/launch", label: "Launch" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-overlay)] backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] shadow-[var(--shadow-xs)]">
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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium transition-all duration-150 ${
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
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)]"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <Button
            variant="secondary"
            size="sm"
            className="hidden gap-2 sm:inline-flex"
          >
            <Wallet size={15} />
            Connect
          </Button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)] sm:hidden"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-card)] px-6 pb-6 pt-4 shadow-[var(--shadow-lg)] sm:hidden slide-in-down">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-[var(--radius-sm)] px-4 py-3 text-sm font-medium transition-all ${
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
            <Button variant="secondary" size="sm" fullWidth className="gap-2">
              <Wallet size={15} />
              Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
