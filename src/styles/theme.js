export const colors = {
  primary: "#7c4dff",
  accent: "#35a7ff",
  success: "#35c759",
  warning: "#ffd23f",
  error: "#ff6b5e",
  xp: "#ffd23f",
  info: "#35a7ff",
  coral: "#ff5cad",
}

export const dark = {
  background: "#171525",
  surface: "#211e35",
  surfaceElevated: "#2b2646",
  text: "#ffffff",
  textSecondary: "#b7b1d2",
  border: "#40385f",
  headerBg: "#171525",
  drawerBg: "#1b1830",
  drawerActive: "#ffffff",
  drawerInactive: "#aaa2c9",
  toggle: "#40385f",
  toggleKnob: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.6)",
  cardBorder: "#40385f",
}

export const light = {
  background: "#fff8e7",
  surface: "#ffffff",
  surfaceElevated: "#fff0b8",
  text: "#20202a",
  textSecondary: "#716b7f",
  border: "#20202a",
  headerBg: "#ffffff",
  drawerBg: "#fff8e7",
  drawerActive: "#20202a",
  drawerInactive: "#716b7f",
  toggle: "#ded8c6",
  toggleKnob: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.4)",
  cardBorder: "#20202a",
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
