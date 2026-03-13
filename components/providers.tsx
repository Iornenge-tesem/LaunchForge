"use client";

import {
  type ReactNode,
  useEffect,
  useState,
  useMemo,
  createContext,
  useContext,
  useCallback,
} from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { sdk } from "@farcaster/miniapp-sdk";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, useAccount } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-forge-ten.vercel.app";
const onchainKitApiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
const cdpProjectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: "LaunchForge",
      appLogoUrl: `${appUrl}/images/launchforge-icon.png`,
    }),
  ],
});

const queryClient = new QueryClient();

/* ── Theme Context ──────────────────────────────────────── */
type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

type MiniAppUser = {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
};

type MiniAppContextValue = {
  user: MiniAppUser | null;
  isMiniApp: boolean;
  address?: `0x${string}`;
  isConnected: boolean;
  notificationsEnabled: boolean;
  promptAddMiniApp: () => Promise<void>;
};

const MiniAppContext = createContext<MiniAppContextValue>({
  user: null,
  isMiniApp: false,
  address: undefined,
  isConnected: false,
  notificationsEnabled: false,
  promptAddMiniApp: async () => {},
});

export const useMiniAppProfile = () => useContext(MiniAppContext);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const resolved = t === "system" ? (prefersDark ? "dark" : "light") : t;

    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Update theme-color meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        resolved === "dark" ? "#0B0F19" : "#F8FAFC"
      );
    }

    setResolvedTheme(resolved);
  }, []);

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t);
      localStorage.setItem("theme", t);
      applyTheme(t);
    },
    [applyTheme]
  );

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? "system";
    setThemeState(initial);
    applyTheme(initial);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange() {
      const current =
        (localStorage.getItem("theme") as Theme | null) ?? "system";
      if (current === "system") {
        applyTheme("system");
      }
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ── MiniKit Provider ───────────────────────────────────── */
function MiniKitProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<MiniAppUser | null>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const promptAddMiniApp = useCallback(async () => {
    try {
      if (!sdk.actions?.addMiniApp) return;
      const result = await sdk.actions.addMiniApp();
      if ("added" in result && result.added && result.notificationDetails) {
        setNotificationsEnabled(true);
      }
    } catch {
      // user rejected or not in mini app context
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    MiniKit.install();

    async function loadContext() {
      try {
        const context = await sdk.context;
        if (!mounted) return;

        const contextUser = context.user;
        if (contextUser) {
          setUser({
            fid: contextUser.fid,
            username: contextUser.username,
            displayName: contextUser.displayName,
            pfpUrl: contextUser.pfpUrl,
          });
          setIsMiniApp(true);
        }

        if (context.client || context.user) {
          setIsMiniApp(true);
        }

        if (sdk.actions?.ready) {
          await sdk.actions.ready();
        }

      } catch {
        // no-op: app still runs outside Mini App host
      }
    }

    loadContext();

    return () => {
      mounted = false;
    };
  }, []);

  // Save user profile to DB when wallet is connected and user data is available
  useEffect(() => {
    if (!address || !user) return;
    fetch("/api/users/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: address,
        fid: user.fid,
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
      }),
    }).catch(() => {});
  }, [address, user]);

  const contextValue = useMemo(
    () => ({ user, isMiniApp, address, isConnected, notificationsEnabled, promptAddMiniApp }),
    [user, isMiniApp, address, isConnected, notificationsEnabled, promptAddMiniApp]
  );

  return (
    <MiniAppContext.Provider value={contextValue}>
      {children}
    </MiniAppContext.Provider>
  );
}

function AppProviders({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <WagmiProvider config={wagmiConfig}>
      <OnchainKitProvider
        apiKey={onchainKitApiKey}
        projectId={cdpProjectId}
        chain={base}
        config={{
          appearance: {
            mode: resolvedTheme,
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider>{children}</MiniKitProvider>
        </QueryClientProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  );
}

/* ── Combined Providers ─────────────────────────────────── */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProviders>{children}</AppProviders>
    </ThemeProvider>
  );
}
