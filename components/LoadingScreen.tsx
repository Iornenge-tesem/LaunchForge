"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type LoadingScreenProps = {
  onComplete: () => void;
  durationMs?: number;
};

export function LoadingScreen({ onComplete, durationMs = 3000 }: LoadingScreenProps) {
  const [sparkVisible, setSparkVisible] = useState(false);

  useEffect(() => {
    const sparkTimer = window.setTimeout(() => setSparkVisible(true), Math.max(0, durationMs - 520));
    const doneTimer = window.setTimeout(() => onComplete(), durationMs + 220);

    return () => {
      window.clearTimeout(sparkTimer);
      window.clearTimeout(doneTimer);
    };
  }, [durationMs, onComplete]);

  const style = useMemo(
    () => ({
      ["--forge-loader-duration" as string]: `${durationMs}ms`,
    }) as CSSProperties,
    [durationMs],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-main)] fade-in" style={style}>
      <div className="relative">
        <svg width="320" height="320" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="forge-loader-svg">
          <path
            id="forge-man"
            d="M40 360 C90 360 120 350 160 340 C200 330 220 320 240 300 C255 285 260 260 250 240 C235 210 210 200 180 205 C160 210 150 220 150 235 C150 255 170 270 190 270 C210 270 230 260 245 245 C260 230 275 220 295 220 C315 220 330 230 335 245 C340 260 335 275 320 285 C305 295 285 300 265 305 C245 310 230 320 225 340 C220 355 225 370 240 380"
            className="forge-line-main"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M210 260 L250 220 L265 230 L225 270"
            className="forge-line-sub"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M260 300 L320 300 L330 310 L250 310 Z"
            className="forge-line-sub"
            strokeWidth="4"
            fill="none"
          />
        </svg>
        <span className={`forge-spark ${sparkVisible ? "forge-spark-visible" : ""}`} />
      </div>
    </div>
  );
}
