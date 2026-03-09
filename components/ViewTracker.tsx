"use client";

import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";

/** Fires a single POST to record a unique view when the user has a connected wallet. */
export function ViewTracker({ projectId }: { projectId: string }) {
  const { address } = useAccount();
  const sent = useRef(false);

  useEffect(() => {
    if (!address || sent.current) return;
    sent.current = true;

    fetch(`/api/projects/${encodeURIComponent(projectId)}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: address }),
    }).catch(() => {});
  }, [address, projectId]);

  return null;
}
