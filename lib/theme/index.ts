export const launchForgeTheme = {
  colors: {
    bgMain: "#070B14",
    bgSoft: "#0E1424",
    forgePrimary: "#2563FF",
    forgeElectric: "#3B82F6",
    forgeGlow: "#7C3AED",
    textMain: "#F8FAFC",
    textDim: "#94A3B8",
  },
  radius: {
    md: "12px",
    lg: "16px",
    xl: "20px",
    pill: "9999px",
  },
  spacing: {
    sectionY: "clamp(4rem, 8vw, 7rem)",
    contentX: "clamp(1rem, 4vw, 2rem)",
  },
} as const;

export const launchForgeMotion = {
  fast: 180,
  base: 260,
  slow: 420,
  loader: 3000,
} as const;
