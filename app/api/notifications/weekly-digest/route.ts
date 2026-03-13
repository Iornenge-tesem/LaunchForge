import { NextResponse } from "next/server";
import { listProjects } from "@/lib/db/projects";
import { broadcastNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();

  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projects = await listProjects({ sort: "highest_score" });
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const weekly = projects
    .filter((p) => new Date(p.createdAt) >= since)
    .sort((a, b) => {
      const aScore = (a.aiScore ?? 0) * 2 + a.likes + a.views * 0.1;
      const bScore = (b.aiScore ?? 0) * 2 + b.likes + b.views * 0.1;
      return bScore - aScore;
    })
    .slice(0, 3);

  const title = "Top Launches This Week";
  const body =
    weekly.length > 0
      ? `${weekly[0].name} is leading this week. See the full leaderboard.`
      : "Check out this week's top launches on LaunchForge.";

  const notify = await broadcastNotification({
    title,
    body,
    targetUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app"}/leaderboard`,
  });

  return NextResponse.json({ ok: true, weeklyCount: weekly.length, notify });
}
