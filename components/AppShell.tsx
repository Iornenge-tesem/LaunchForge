"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Container } from "@/components/Container";
import { HammerLoader } from "@/components/HammerLoader";

type AppShellProps = {
  children: ReactNode;
};

type BootPhase = "loading" | "exiting" | "ready";

export function AppShell({ children }: AppShellProps) {
  const [phase, setPhase] = useState<BootPhase>("loading");

  useEffect(() => {
    const startExitTimer = window.setTimeout(() => setPhase("exiting"), 2200);
    const readyTimer = window.setTimeout(() => setPhase("ready"), 2500);

    return () => {
      window.clearTimeout(startExitTimer);
      window.clearTimeout(readyTimer);
    };
  }, []);

  const contentClassName = useMemo(
    () =>
      `relative min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-opacity duration-300 ${
        phase === "ready" ? "opacity-100" : "opacity-0"
      }`,
    [phase],
  );

  return (
    <>
      {phase !== "ready" && (
        <div
          className={`fixed inset-0 z-[120] transition-opacity duration-300 ${
            phase === "exiting" ? "opacity-0" : "opacity-100"
          }`}
        >
          <HammerLoader />
        </div>
      )}

      <div className={contentClassName}>
        <Navbar />
        <main className="mx-auto w-full">{children}</main>
        <footer className="border-t border-[rgba(148,163,184,0.14)] py-5">
          <Container className="flex items-center justify-between gap-3 text-xs text-[var(--text-dim)]">
            <p>© {new Date().getFullYear()} LaunchForge</p>
            <p>Built for serious builders</p>
          </Container>
        </footer>
      </div>
    </>
  );
}
