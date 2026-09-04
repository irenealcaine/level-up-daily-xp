import { StyleSheet, Text, View, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import Card from "../components/Card"
import Avatar from "../components/Avatar"
import Badge from "../components/Badge"
import XPBar from "../components/XPBar"

const sections = [
  { id: "1", title: "Pasos y rutas", icon: "walk-outline", screen: "Section1", colorKey: "primary" },
  { id: "2", title: "Hábitos y tareas", icon: "checkbox-outline", screen: "Section2", colorKey: "success" },
  { id: "3", title: "Calorías y compras", icon: "restaurant-outline", screen: "Section3", colorKey: "coral" },
  { id: "4", title: "Finanzas", icon: "wallet-outline", screen: "Finance", colorKey: "warning" },
]

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme()
  const { userProfile } = useAuth()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Avatar name={userProfile?.nick || "U"} size="lg" level={8} />
            <View style={styles.profileInfo}>
              <Text style={[styles.greeting, { color: theme.text }]}>
                ¡Buenas, {userProfile?.nick || "Usuario"}!
              </Text>
              <Text style={[styles.motto, { color: theme.textSecondary }]}>¿Qué toca subir hoy?</Text>
              <Badge variant="xp" size="sm">Nivel 8</Badge>
            </View>
          </View>
          <XPBar currentXP={750} maxXP={1000} level={8} style={styles.xpBar} />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Misiones de hoy
        </Text>

        <View style={styles.grid}>
          {sections.map((section) => (
            <Card
              key={section.id}
              variant="default"
              onPress={() => navigation.navigate(section.screen)}
              style={styles.sectionCard}
            >
              <View style={[styles.iconContainer, { backgroundColor: theme.colors[section.colorKey] }]}>
                <Ionicons name={section.icon} size={28} color="#ffffff" />
              </View>
              <Text style={[styles.sectionName, { color: theme.text }]}>
                {section.title}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    marginBottom: 16,
    marginTop: 4,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  motto: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  xpBar: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  grid: {
    gap: 8,
    paddingBottom: 16,
  },
  sectionCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionName: {
    fontSize: 15,
    fontWeight: "600",
  },
})
