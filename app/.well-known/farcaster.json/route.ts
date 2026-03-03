import { NextResponse } from "next/server";
import minikitConfig from "@/minikit.config";

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    frame: {
      version: "1",
      name: minikitConfig.appName,
      subtitle: minikitConfig.subtitle,
      description: minikitConfig.description,
      primaryCategory: minikitConfig.primaryCategory,
      tags: minikitConfig.tags,
      iconUrl: minikitConfig.imageUrl,
      homeUrl: minikitConfig.homeUrl,
      imageUrl: minikitConfig.imageUrl,
      splashImageUrl: minikitConfig.splashImageUrl,
      splashBackgroundColor: minikitConfig.splashBackgroundColor,
      heroImageUrl: minikitConfig.heroImageUrl,
    },
  };

  return NextResponse.json(manifest);
}
