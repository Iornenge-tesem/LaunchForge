import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import minikitConfig from "@/minikit.config";
import { Navbar } from "@/components/Navbar";
import { Container } from "@/components/Container";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

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
        <meta name="theme-color" content="#0F0F0F" />
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
        <Providers>
          <div className="relative flex min-h-[100dvh] flex-col bg-[var(--bg-main)] text-[var(--text-main)]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[var(--border)] py-5">
              <Container className="flex flex-col items-center justify-between gap-2 text-xs text-[var(--text-dim)] sm:flex-row">
                <p>© {new Date().getFullYear()} LaunchForge</p>
                <p className="flex items-center gap-1.5">
                  Built for serious builders on
                  <svg width="14" height="14" viewBox="0 0 500 500" fill="var(--accent)">
                    <path d="M250 500c138.071 0 250-111.929 250-250S388.071 0 250 0 0 111.929 0 250s111.929 250 250 250z"/>
                  </svg>
                  Base
                </p>
              </Container>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
