import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

export default function Header({
  title,
  subtitle,
  rightActions = [],
  style,
}) {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightActions.length > 0 && (
        <View style={styles.actions}>
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={[styles.actionButton, { backgroundColor: theme.surface }]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={action.icon}
                size={22}
                color={theme.text}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
})
