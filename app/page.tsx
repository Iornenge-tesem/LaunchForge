"use client";

import { useCallback, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Container } from "@/components/ui/Container";
import { GlowBackground } from "@/components/ui/GlowBackground";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [ready, setReady] = useState(false);
  const handleComplete = useCallback(() => setReady(true), []);

  if (!ready) {
    return <LoadingScreen onComplete={handleComplete} />;
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <GlowBackground />
      <Container className="relative z-10 flex min-h-screen items-center justify-center py-24">
        <section className="fade-in w-full max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-[var(--text-main)] sm:text-5xl">
            LaunchForge
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--text-dim)] sm:text-xl">
            The launchpad for serious builders.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button variant="primary">Launch Project</Button>
            <Button variant="secondary">Explore Projects</Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
