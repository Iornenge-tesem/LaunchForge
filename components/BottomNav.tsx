"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Rocket, LayoutDashboard } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/launch", label: "Launch", icon: Rocket },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--bg-card)]/95 px-2 py-2 backdrop-blur-xl sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-[54px] flex-col items-center justify-center rounded-xl text-xs font-medium transition-all ${
                active
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "text-[var(--text-dim)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)]"
              }`}
            >
              <Icon size={16} />
              <span className="mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
