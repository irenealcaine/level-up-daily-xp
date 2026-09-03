import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme()
  const { logout, userProfile } = useAuth()

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

      {userProfile && (
        <View style={[styles.card, { backgroundColor: theme.surface, marginTop: 12 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Sesión activa</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>{userProfile.email}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.surface, marginTop: 12 }]}
        activeOpacity={0.7}
        onPress={logout}
      >
        <Text style={[styles.logoutText, { color: "#e53935" }]}>Cerrar sesión</Text>
      </TouchableOpacity>
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
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "600",
  },
})
