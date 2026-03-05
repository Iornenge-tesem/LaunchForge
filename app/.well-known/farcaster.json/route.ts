import { NextResponse } from "next/server";
import minikitConfig from "@/minikit.config";

function withValidProperties(
  properties: Record<string, undefined | string | string[] | boolean>
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined
    )
  );
}

export async function GET() {
  const manifest = {
    accountAssociation: minikitConfig.accountAssociation,
    miniapp: withValidProperties({
      version: minikitConfig.version,
      name: minikitConfig.appName,
      homeUrl: minikitConfig.homeUrl,
      iconUrl: minikitConfig.iconUrl,
      splashImageUrl: minikitConfig.splashImageUrl,
      splashBackgroundColor: minikitConfig.splashBackgroundColor,
      webhookUrl: minikitConfig.webhookUrl,
      subtitle: minikitConfig.subtitle,
      description: minikitConfig.description,
      screenshotUrls: minikitConfig.screenshotUrls,
      primaryCategory: minikitConfig.primaryCategory,
      tags: minikitConfig.tags,
      heroImageUrl: minikitConfig.heroImageUrl,
      tagline: minikitConfig.tagline,
      ogTitle: minikitConfig.ogTitle,
      ogDescription: minikitConfig.ogDescription,
      ogImageUrl: minikitConfig.ogImageUrl,
      noindex: minikitConfig.noindex,
    }),
  };

  return NextResponse.json(manifest);
}
