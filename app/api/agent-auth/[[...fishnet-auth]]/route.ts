import { fishnetAuth } from "fishnet-auth/nextjs";
import { SupabaseAdapter } from "fishnet-auth/adapters/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Fishnet Auth — Reverse CAPTCHA for AI agents.
 *
 * Agents must prove LLM-level reasoning before they receive an API key.
 * Uses a Supabase adapter to store session tokens.
 *
 * Usage:
 *   GET  /api/agent-auth         → current seed + task definitions
 *   POST /api/agent-auth         → submit answers, receive credentials
 *   GET  /api/agent-auth/session → validate existing credentials
 */
export const { GET, POST } = fishnetAuth({
  secret: process.env.FISHNET_AUTH_SECRET!,
  adapter: SupabaseAdapter(supabase as any),
});
