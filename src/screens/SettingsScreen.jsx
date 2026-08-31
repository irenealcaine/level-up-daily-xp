import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Ajustes</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.text }]}>Modo oscuro</Text>
        <TouchableOpacity
          style={[styles.toggle, { backgroundColor: isDark ? theme.text : theme.toggle }]}
          activeOpacity={0.7}
          onPress={toggleTheme}
        >
          <View
            style={[
              styles.knob,
              {
                backgroundColor: theme.toggleKnob,
                transform: [{ translateX: isDark ? 22 : 2 }],
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  label: {
    fontSize: 17,
    fontWeight: "500",
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    padding: 2,
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
})
