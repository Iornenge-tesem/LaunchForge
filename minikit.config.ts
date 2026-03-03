export type MiniKitConfig = {
  appId: string;
  appName: string;
  subtitle: string;
  description: string;
  version: "1";
  accountAssociation: {
    header: string;
    payload: string;
    signature: string;
  };
  primaryCategory: string;
  tags: string[];
  tagline: string;
  iconUrl: string;
  homeUrl: string;
  splashImageUrl: string;
  splashBackgroundColor: string;
  heroImageUrl: string;
  screenshotUrls: string[];
};

const config: MiniKitConfig = {
  
  appId: "69a3c763955255bb0fb04e07",
  appName: "LaunchForge",
  subtitle: "Launch serious crypto projects",
  description: "A launchpad for real builders and experimental ideas.",
  version: "1",
  accountAssociation: {
    header: process.env.FARCASTER_HEADER ?? "",
    payload: process.env.FARCASTER_PAYLOAD ?? "",
    signature: process.env.FARCASTER_SIGNATURE ?? "",
  },
  primaryCategory: "finance",
  tags: ["launchpad", "crypto", "builders", "tokens"],
  tagline: "Launch serious crypto projects",
  iconUrl: "https://placehold.co/1024x1024/png?text=LaunchForge",
  homeUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://launchforge.vercel.app",
  splashImageUrl: "https://placehold.co/200x200/png?text=LF",
  splashBackgroundColor: "#050505",
  heroImageUrl: "https://placehold.co/1200x630/png?text=LaunchForge+Hero",
  screenshotUrls: [
    "https://placehold.co/1284x2778/png?text=LaunchForge+Screenshot+1",
    "https://placehold.co/1284x2778/png?text=LaunchForge+Screenshot+2",
    "https://placehold.co/1284x2778/png?text=LaunchForge+Screenshot+3",
  ],
};

export default config;
