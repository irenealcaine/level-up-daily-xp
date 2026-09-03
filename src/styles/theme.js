export const colors = {
  primary: "#6c5ce7",
  accent: "#00cec9",
  success: "#00b894",
  warning: "#fdcb6e",
  error: "#e53935",
  xp: "#ffd32a",
  info: "#0984e3",
}

export const dark = {
  background: "#0f0f1a",
  surface: "#1a1a2e",
  surfaceElevated: "#222240",
  text: "#ffffff",
  textSecondary: "#8888aa",
  border: "#2a2a3e",
  headerBg: "#0f0f1a",
  drawerBg: "#12122a",
  drawerActive: "#ffffff",
  drawerInactive: "#666688",
  toggle: "#2a2a3e",
  toggleKnob: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.6)",
  cardBorder: "#2a2a3e",
}

export const light = {
  background: "#f8f9ff",
  surface: "#ffffff",
  surfaceElevated: "#f0f0ff",
  text: "#111122",
  textSecondary: "#666688",
  border: "#e0e0f0",
  headerBg: "#ffffff",
  drawerBg: "#f8f9ff",
  drawerActive: "#111122",
  drawerInactive: "#999999",
  toggle: "#ddddee",
  toggleKnob: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.4)",
  cardBorder: "#e0e0f0",
}

export const typography = {
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: "600",
  },
  caption: {
    fontSize: 14,
    fontWeight: "500",
  },
  small: {
    fontSize: 12,
    fontWeight: "500",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
}

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
}

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
}

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
}

export default {
  colors,
  dark,
  light,
  typography,
  spacing,
  borderRadius,
  shadows,
}
