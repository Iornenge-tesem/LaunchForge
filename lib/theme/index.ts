export const theme = {
  colors: {
    /* Light theme references */
    bgMain: "#F7F7F8",
    bgCard: "#FFFFFF",
    bgElevated: "#F0F0F2",
    bgInput: "#F5F5F7",
    accent: "#2563EB",
    accentHover: "#1D4ED8",
    green: "#059669",
    amber: "#D97706",
    red: "#DC2626",
    purple: "#7C3AED",
    textMain: "#1A1A1A",
    textSecondary: "#555555",
    textDim: "#B0B0B0",

    /* Dark theme references */
    dark: {
      bgMain: "#0F0F0F",
      bgCard: "#1A1A1A",
      bgElevated: "#222222",
      bgInput: "#161616",
      accent: "#4DA3FF",
      accentHover: "#6BB5FF",
      green: "#34D399",
      amber: "#FBBF24",
      red: "#F87171",
      purple: "#8B5CF6",
      textMain: "#E5E5E5",
      textSecondary: "#B0B0B0",
      textDim: "#707070",
    },
  },
  radius: {
    sm: "5px",
    md: "5px",
    lg: "5px",
    xl: "5px",
  },
  motion: {
    fast: 150,
    base: 250,
    slow: 400,
  },
} as const;
