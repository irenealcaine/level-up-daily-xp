import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import Card from "../components/Card"

export default function Section2Screen() {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.icon, { backgroundColor: theme.colors.success }]}>
          <Ionicons name="checkbox-outline" size={34} color="#ffffff" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Hábitos y tareas</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Pequeños checks. Grandes rachas.</Text>
        <Card variant="elevated" style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Tu lista está esperando</Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>Completa una tarea diaria y mantén tu racha en marcha.</Text>
        </Card>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
  },
})
