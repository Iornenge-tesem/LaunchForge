import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import minikitConfig from "@/minikit.config";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

export const metadata: Metadata = {
  title: minikitConfig.appName,
  description: minikitConfig.description,
  icons: {
    icon: [{ url: "/images/launchforge-icon.png", type: "image/png" }],
    shortcut: ["/images/launchforge-icon.png"],
    apple: [{ url: "/images/launchforge-icon.png" }],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: minikitConfig.iconUrl,
      button: {
        title: "Launch Project",
        action: {
          type: "launch_frame",
          name: `Launch ${minikitConfig.appName}`,
          url: minikitConfig.homeUrl,
          splashImageUrl: minikitConfig.splashImageUrl,
          splashBackgroundColor: minikitConfig.splashBackgroundColor,
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="base:app_id" content="69a3c763955255bb0fb04e07" />
        <link rel="icon" type="image/png" href="/images/launchforge-icon.png" />
        <link rel="shortcut icon" href="/images/launchforge-icon.png" />
        <link rel="apple-touch-icon" href="/images/launchforge-icon.png" />
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "next",
            imageUrl: minikitConfig.iconUrl,
            button: {
              title: "Launch Project",
              action: {
                type: "launch_frame",
                name: `Launch ${minikitConfig.appName}`,
                url: appUrl,
                splashImageUrl: minikitConfig.splashImageUrl,
                splashBackgroundColor: minikitConfig.splashBackgroundColor,
              },
            },
          })}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
