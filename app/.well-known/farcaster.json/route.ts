import { NextResponse } from "next/server";
import minikitConfig from "@/minikit.config";

export async function GET() {
  const manifest = {
    accountAssociation: minikitConfig.accountAssociation,
    frame: {
      version: minikitConfig.version,
      name: minikitConfig.appName,
      subtitle: minikitConfig.subtitle,
      description: minikitConfig.description,
      primaryCategory: minikitConfig.primaryCategory,
      tags: minikitConfig.tags,
      tagline: minikitConfig.tagline,
      iconUrl: minikitConfig.iconUrl,
      homeUrl: minikitConfig.homeUrl,
      splashImageUrl: minikitConfig.splashImageUrl,
      splashBackgroundColor: minikitConfig.splashBackgroundColor,
      heroImageUrl: minikitConfig.heroImageUrl,
      screenshotUrls: minikitConfig.screenshotUrls,
      webhookUrl: minikitConfig.webhookUrl,
      ogTitle: minikitConfig.ogTitle,
      ogDescription: minikitConfig.ogDescription,
      ogImageUrl: minikitConfig.ogImageUrl,
    },
  };

  return NextResponse.json(manifest);
}
