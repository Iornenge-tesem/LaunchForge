"use client";

import { type ReactNode, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install();
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return <MiniKitProvider>{children}</MiniKitProvider>;
}
