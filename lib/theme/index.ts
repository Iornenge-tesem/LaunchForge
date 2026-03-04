export const theme = {
  colors: {
    /* Light theme references */
    bgMain: "#F8FAFC",
    bgCard: "#FFFFFF",
    bgElevated: "#F1F5F9",
    bgInput: "#FFFFFF",
    accent: "#3B82F6",
    accentHover: "#2563EB",
    green: "#10B981",
    amber: "#F59E0B",
    red: "#EF4444",
    purple: "#6366F1",
    textMain: "#0F172A",
    textSecondary: "#475569",
    textDim: "#94A3B8",

    /* Dark theme references */
    dark: {
      bgMain: "#0B0F19",
      bgCard: "#1F2937",
      bgElevated: "#111827",
      bgInput: "#0F172A",
      accent: "#3B82F6",
      accentHover: "#2563EB",
      green: "#10B981",
      amber: "#F59E0B",
      red: "#EF4444",
      purple: "#818CF8",
      textMain: "#F9FAFB",
      textSecondary: "#9CA3AF",
      textDim: "#6B7280",
    },
  },
  radius: {
    sm: "10px",
    md: "10px",
    lg: "14px",
    xl: "14px",
  },
  motion: {
    fast: 150,
    base: 250,
    slow: 400,
  },
} as const;
