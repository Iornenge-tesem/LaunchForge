export type MiniKitConfig = {
  appId: string;
  appName: string;
  subtitle: string;
  description: string;
  primaryCategory: string;
  tags: string[];
  imageUrl: string;
  homeUrl: string;
  splashImageUrl: string;
  splashBackgroundColor: string;
  heroImageUrl: string;
};

const config: MiniKitConfig = {
  appId: "launchforge",
  appName: "LaunchForge",
  subtitle: "Launch serious crypto projects",
  description: "A launchpad for real builders and experimental ideas.",
  primaryCategory: "defi",
  tags: ["launchpad", "crypto", "builders", "tokens"],
  imageUrl: "",
  homeUrl: "",
  splashImageUrl: "",
  splashBackgroundColor: "#050505",
  heroImageUrl: "",
};

export default config;
