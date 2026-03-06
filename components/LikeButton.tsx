"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function LikeButton({
  projectId,
  initialLikes,
}: {
  projectId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    setLikes((prev) => prev + 1);

    try {
      await fetch(`/api/projects/${encodeURIComponent(projectId)}/like`, {
        method: "POST",
      });
    } catch {
      // revert on failure
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
