import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

const SIZES = {
  sm: { paddingVertical: 2, paddingHorizontal: 8, fontSize: 11 },
  md: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 13 },
  lg: { paddingVertical: 6, paddingHorizontal: 14, fontSize: 15 },
}

export default function Badge({
  variant = "default",
  size = "md",
  children,
  style,
}) {
  const { theme } = useTheme()

  const getContainerStyle = () => {
    const base = {
      paddingVertical: SIZES[size].paddingVertical,
      paddingHorizontal: SIZES[size].paddingHorizontal,
      borderRadius: theme.borderRadius.full,
      alignSelf: "flex-start",
    }

    switch (variant) {
      case "primary":
        return { ...base, backgroundColor: theme.colors.primary }
      case "accent":
        return { ...base, backgroundColor: theme.colors.accent }
      case "success":
        return { ...base, backgroundColor: theme.colors.success }
      case "warning":
        return { ...base, backgroundColor: theme.colors.warning }
      case "error":
        return { ...base, backgroundColor: theme.colors.error }
      case "xp":
        return { ...base, backgroundColor: theme.colors.xp }
      case "outline":
        return {
          ...base,
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: theme.colors.primary,
        }
      default:
        return { ...base, backgroundColor: theme.surface }
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "warning":
        return "#111"
      case "outline":
        return theme.colors.primary
      default:
        return "#fff"
    }
  }

  return (
    <View style={[getContainerStyle(), style]}>
      <Text style={[styles.text, { color: getTextColor(), fontSize: SIZES[size].fontSize }]}>
        {children}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
})
