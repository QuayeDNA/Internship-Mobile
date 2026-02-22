// design tokens based on the UI spec
export const colors = {
  primary: "#1A3C6E",
  primaryLight: "#2A5BA8",
  accent: "#F4A622",
  accentLight: "#FBBF4A",
  background: "#F5F6FA",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF1F8",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textDisabled: "#9CA3AF",
  border: "#E5E7EB",
  borderFocus: "#1A3C6E",
  success: "#16A34A",
  successLight: "#DCFCE7",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  info: "#2563EB",
  infoLight: "#DBEAFE",
};

export const statusColors = {
  notRegistered: { bg: colors.errorLight, text: colors.error },
  pending: { bg: colors.warningLight, text: colors.warning },
  assigned: { bg: colors.successLight, text: colors.success },
};

export const typography = {
  displayLarge: {
    fontFamily: "Outfit_700Bold",
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: "Outfit_700Bold",
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  heading1: { fontFamily: "Outfit_600SemiBold", fontSize: 20, lineHeight: 26 },
  heading2: { fontFamily: "Outfit_600SemiBold", fontSize: 17, lineHeight: 22 },
  bodyLarge: { fontFamily: "Inter_400Regular", fontSize: 16, lineHeight: 24 },
  body: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22 },
  bodySmall: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 18 },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  caption: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  button: { fontFamily: "Inter_600SemiBold", fontSize: 15, letterSpacing: 0.3 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: "#1A3C6E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const animation = {
  durationFast: 150,
  durationNormal: 250,
  durationSlow: 400,
  easing: [0.25, 0.1, 0.25, 1], // bezier
};
