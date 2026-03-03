import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(148,163,184,0.16)] bg-[rgba(7,11,20,0.82)] backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 overflow-hidden rounded-md border border-[rgba(148,163,184,0.2)]">
            <img src="/images/launchforge-icon.png" alt="LaunchForge logo" className="h-full w-full object-cover" />
          </span>
          <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-main)] sm:text-base">LaunchForge</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/explore" className="text-sm text-[var(--text-dim)] transition-colors hover:text-[var(--text-main)]">
            Explore
          </Link>
          <Link href="/launch" className="text-sm text-[var(--text-dim)] transition-colors hover:text-[var(--text-main)]">
            Launch
          </Link>
        </nav>

        <div className="w-auto">
          <Button variant="ghost" className="min-h-10 rounded-xl px-4 text-sm sm:min-h-11">
            Connect Wallet
          </Button>
        </div>
      </Container>
    </header>
  );
}
