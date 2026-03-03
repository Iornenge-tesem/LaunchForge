import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://launchforge.vercel.app";

export const metadata: Metadata = {
  title: "LaunchForge",
  description: "A launchpad for real builders and experimental ideas.",
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
        <meta name="fc:miniapp" content={`${appUrl}/.well-known/farcaster.json`} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
