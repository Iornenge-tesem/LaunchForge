export type MiniKitConfig = {
  appId: string;
  appName: string;
  subtitle: string;
  description: string;
  version: "1";
  rootUrl: string;
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
  webhookUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  noindex: boolean;
};

const rootUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

const config: MiniKitConfig = {
  appId: "69a3c763955255bb0fb04e07",
  appName: "LaunchForge",
  subtitle: "Launch serious crypto projects",
  description: "A launchpad for real builders and experimental ideas.",
  version: "1",
  rootUrl,
  accountAssociation: {
    header: "eyJmaWQiOjE3OTkwNTQsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgwMTQ5MUQ1MjcxOTA1MjhjY0JDMzQwRGU4MGJmMkU0NDdkQ2M0ZmUzIn0",
    payload: "eyJkb21haW4iOiJsYXVuY2gtZm9yZ2UtdGVuLnZlcmNlbC5hcHAifQ",
    signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGzrMDy5D6GdZ_YzgzQ0PUsWmtZlgFNFZH9n4LHSLB4BW6Nq6J9K2U7JFT1UvoOgfyT4f32psyl-1YTRqEug_qrGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  },
  primaryCategory: "defi",
  tags: ["launchpad", "crypto", "builders", "tokens"],
  tagline: "The launchpad for serious builders",
  iconUrl: `${rootUrl}/images/launchforge-icon.png`,
  homeUrl: rootUrl,
  splashImageUrl: `${rootUrl}/images/launchforge-icon.png`,
  splashBackgroundColor: "#9CA3AF",
  heroImageUrl: `${rootUrl}/images/screenshot1.png`,
  screenshotUrls: [
    `${rootUrl}/images/screenshot1.png`,
    `${rootUrl}/images/screenshot2.png`,
    `${rootUrl}/images/screenshot3.png`,
  ],
  webhookUrl: `${rootUrl}/api/webhook`,
  ogTitle: "LaunchForge",
  ogDescription: "A launchpad for real builders and experimental ideas.",
  ogImageUrl: `${rootUrl}/images/launchforge-icon.png`,
  noindex: true,
};

export default config;
