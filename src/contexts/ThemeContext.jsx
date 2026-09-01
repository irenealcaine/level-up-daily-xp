import { createContext, useContext, useState } from "react"

const ThemeContext = createContext()

const themes = {
  dark: {
    background: "#0a0a0a",
    surface: "#1a1a1a",
    text: "#fff",
    textSecondary: "#888",
    link: "#6ea8fe",
    border: "#333",
    headerBg: "#0a0a0a",
    drawerBg: "#111",
    drawerActive: "#fff",
    drawerInactive: "#666",
    toggle: "#333",
    toggleKnob: "#fff",
  },
  light: {
    background: "#fafafa",
    surface: "#fff",
    text: "#111",
    textSecondary: "#999",
    link: "#0066cc",
    border: "#ddd",
    headerBg: "#fff",
    drawerBg: "#fafafa",
    drawerActive: "#111",
    drawerInactive: "#999",
    toggle: "#ddd",
    toggleKnob: "#fff",
  },
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => setIsDark((prev) => !prev)
  const theme = isDark ? themes.dark : themes.light

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
