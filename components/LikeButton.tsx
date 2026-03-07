"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useMiniAppProfile } from "@/components/providers";

export function LikeButton({
  projectId,
  initialLikes,
}: {
  projectId: string;
  initialLikes: number;
}) {
  const { address } = useMiniAppProfile();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  // Check if current wallet already liked this project
  useEffect(() => {
    if (!address) return;
    fetch(
      `/api/projects/${encodeURIComponent(projectId)}/like/check?wallet=${encodeURIComponent(address)}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.liked) setLiked(true);
      })
      .catch(() => {});
  }, [address, projectId]);

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    setLikes((prev) => prev + 1);

    try {
      const res = await fetch(
        `/api/projects/${encodeURIComponent(projectId)}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: address }),
        }
      );
      if (!res.ok) {
        // revert on failure (e.g. already liked)
        setLiked(false);
        setLikes((prev) => prev - 1);
      }
    } catch {
      setLiked(false);
      setLikes((prev) => prev - 1);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`inline-flex cursor-pointer items-center gap-1.5 text-sm transition-colors ${
        liked
          ? "text-[var(--red)]"
          : "text-[var(--text-secondary)] hover:text-[var(--red)]"
      }`}
    >
      <Heart size={14} className={liked ? "fill-current" : ""} />
      {likes} {likes === 1 ? "like" : "likes"}
    </button>
  );
}
