import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

const SIZES = {
  sm: { container: 32, text: 13, border: 2 },
  md: { container: 44, text: 16, border: 2 },
  lg: { container: 56, text: 20, border: 3 },
  xl: { container: 72, text: 26, border: 3 },
}

export default function Avatar({
  name = "",
  image,
  size = "md",
  level,
  style,
}) {
  const { theme } = useTheme()
  const sizeConfig = SIZES[size]

  const getInitials = () => {
    if (!name) return "?"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const getLevelColor = () => {
    if (!level) return theme.border
    if (level >= 50) return theme.colors.xp
    if (level >= 30) return theme.colors.primary
    if (level >= 15) return theme.colors.accent
    return theme.colors.success
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeConfig.container,
          height: sizeConfig.container,
          borderRadius: sizeConfig.container / 2,
          backgroundColor: theme.colors.primary,
          borderWidth: sizeConfig.border,
          borderColor: getLevelColor(),
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: sizeConfig.text,
            color: "#fff",
          },
        ]}
      >
        {getInitials()}
      </Text>
      {level !== undefined && (
        <View
          style={[
            styles.levelBadge,
            {
              backgroundColor: getLevelColor(),
              width: sizeConfig.container * 0.35,
              height: sizeConfig.container * 0.35,
              borderRadius: sizeConfig.container * 0.175,
            },
          ]}
        >
          <Text
            style={[
              styles.levelText,
              { fontSize: sizeConfig.text * 0.55 },
            ]}
          >
            {level}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontWeight: "700",
  },
  levelBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  levelText: {
    color: "#fff",
    fontWeight: "700",
  },
})
