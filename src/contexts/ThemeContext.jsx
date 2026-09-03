import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { colors, dark, light, typography, spacing, borderRadius, shadows } from "../styles/theme"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme()
  const [isDark, setIsDark] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem("theme").then((stored) => {
      if (stored !== null) {
        setIsDark(stored === "dark")
      } else if (systemScheme) {
        setIsDark(systemScheme === "dark")
      }
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem("theme", isDark ? "dark" : "light")
    }
  }, [isDark, loaded])

  const toggleTheme = () => setIsDark((prev) => !prev)

  const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    ...(isDark ? dark : light),
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
