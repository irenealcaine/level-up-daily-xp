import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import Card from "../components/Card"

export default function Section1Screen() {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }] }>
      <View style={styles.content}>
        <View style={[styles.icon, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="walk-outline" size={34} color="#ffffff" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Pasos y rutas</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Muévete un poco. Suma un montón.</Text>
        <Card variant="elevated" style={styles.card}>
          <Ionicons name="map-outline" size={38} color={theme.colors.primary} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>El mapa estará disponible en móvil</Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>Abre la app con Expo Go en Android o iOS para ver tu posición.</Text>
        </Card>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    width: "100%",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
})
