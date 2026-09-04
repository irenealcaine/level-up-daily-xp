import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/Header"
import Card from "../components/Card"
import Avatar from "../components/Avatar"
import Button from "../components/Button"

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme()
  const { logout, userProfile } = useAuth()
  const toggleX = useSharedValue(isDark ? 22 : 2)

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleX.value }],
  }))

  const handleToggle = () => {
    toggleX.value = withSpring(isDark ? 2 : 22, { damping: 15, stiffness: 300 })
    toggleTheme()
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Ajustes" />

      <View style={styles.content}>
        <Card variant="default" style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Modo oscuro
              </Text>
              <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
                {isDark ? "Activado" : "Desactivado"}
              </Text>
            </View>
            <Pressable
              onPress={handleToggle}
              accessibilityRole="switch"
              accessibilityLabel="Cambiar modo oscuro"
              accessibilityState={{ checked: isDark }}
              style={[
                styles.toggle,
                {
                  backgroundColor: isDark ? theme.colors.primary : theme.toggle,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.knob,
                  knobStyle,
                  { backgroundColor: theme.toggleKnob },
                ]}
              />
            </Pressable>
          </View>
        </Card>

        {userProfile && (
          <Card variant="default" style={styles.card}>
            <View style={styles.profileRow}>
              <Avatar name={userProfile.nick || "U"} size="md" />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {userProfile.nick}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                  {userProfile.email}
                </Text>
              </View>
            </View>
          </Card>
        )}

        <Button
          variant="outline"
          size="lg"
          onPress={logout}
          icon="log-out-outline"
          style={[styles.logoutButton, { borderColor: theme.colors.error }]}
        >
          Cerrar sesión
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 2,
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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 12,
  },
})
