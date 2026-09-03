import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

export default function IconBadge({
  icon,
  count = 0,
  color,
  size = 24,
  badgeColor,
  style,
}) {
  const { theme } = useTheme()
  const iconColor = color || theme.text

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={size} color={iconColor} />
      {count > 0 && (
        <View
          style={[
            styles.badge,
            { backgroundColor: badgeColor || theme.colors.error },
          ]}
        >
          <Text style={styles.count}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  count: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
})
