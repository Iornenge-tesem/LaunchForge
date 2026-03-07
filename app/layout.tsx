import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import minikitConfig from "@/minikit.config";
import { Navbar } from "@/components/Navbar";
import { Container } from "@/components/Container";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";

export const metadata: Metadata = {
  title: minikitConfig.appName,
  description: minikitConfig.description,
  metadataBase: new URL(appUrl),
  openGraph: {
    title: minikitConfig.ogTitle,
    description: minikitConfig.ogDescription,
    url: appUrl,
    siteName: minikitConfig.appName,
    images: [
      {
        url: minikitConfig.ogImageUrl,
        width: 1200,
        height: 1200,
        alt: `${minikitConfig.appName} icon preview`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: minikitConfig.ogTitle,
    description: minikitConfig.ogDescription,
    images: [minikitConfig.ogImageUrl],
  },
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
          type: "launch_miniapp",
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
                type: "launch_miniapp",
                name: `Launch ${minikitConfig.appName}`,
                url: appUrl,
                splashImageUrl: minikitConfig.splashImageUrl,
                splashBackgroundColor: minikitConfig.splashBackgroundColor,
              },
            },
          })}
        />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme:dark)").matches;if(t==="dark"||(t!=="light"&&d)){document.documentElement.classList.add("dark");document.querySelector('meta[name="theme-color"]')?.setAttribute("content","#0B0F19")}else{document.querySelector('meta[name="theme-color"]')?.setAttribute("content","#F8FAFC")}}catch(e){}})()`,
          }}
        />
        <meta name="theme-color" content="#F8FAFC" />
      </head>
      <body
        className="font-[family-name:var(--font-sans),ui-sans-serif,system-ui,-apple-system,sans-serif]"
      >
        <Providers>
          <div className="relative flex min-h-[100dvh] flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1 overflow-x-hidden">{children}</main>
            <footer className="border-t border-[var(--border)] py-6">
              <Container className="flex flex-col items-center justify-between gap-3 text-sm text-[var(--text-dim)] sm:flex-row">
                <p>&copy; {new Date().getFullYear()} LaunchForge</p>
                <div className="flex items-center gap-6">
                  <a
                    href="#"
                    className="transition-colors hover:text-[var(--text-secondary)]"
                  >
                    Terms
                  </a>
                  <a
                    href="#"
                    className="transition-colors hover:text-[var(--text-secondary)]"
                  >
                    Privacy
                  </a>
                  <a
                    href="#"
                    className="transition-colors hover:text-[var(--text-secondary)]"
                  >
                    Docs
                  </a>
                </div>
                <p className="flex items-center gap-1.5">
                  Built on
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 111 111"
                    fill="var(--accent)"
                  >
                    <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" />
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
