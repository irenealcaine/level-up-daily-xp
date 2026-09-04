import { useState } from "react"
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import Card from "../components/Card"
import Avatar from "../components/Avatar"
import Badge from "../components/Badge"
import XPBar from "../components/XPBar"
import MissionCard from "../components/MissionCard"

const sections = [
  { id: "1", title: "Pasos y rutas", icon: "walk-outline", screen: "Section1", colorKey: "primary" },
  { id: "2", title: "Hábitos y tareas", icon: "checkbox-outline", screen: "Section2", colorKey: "success" },
  { id: "3", title: "Calorías y compras", icon: "restaurant-outline", screen: "Section3", colorKey: "coral" },
  { id: "4", title: "Finanzas", icon: "wallet-outline", screen: "Finance", colorKey: "warning" },
]

const missions = {
  daily: [
    { icon: "create-outline", title: "Registrar el saldo del día", detail: "0/1", progress: 0, xp: 5, colorKey: "primary" },
    { icon: "eye-outline", title: "Revisar un gasto", detail: "1/1", progress: 1, xp: 5, colorKey: "success" },
    { icon: "hourglass-outline", title: "Evitar compras impulsivas", detail: "0/1", progress: 0, xp: 10, colorKey: "coral" },
  ],
  weekly: [
    { icon: "list-outline", title: "Registrar todos tus movimientos", detail: "2/7", progress: 2 / 7, xp: 25, colorKey: "accent" },
    { icon: "flag-outline", title: "Ahorrar tu objetivo semanal", detail: "0/1", progress: 0, xp: 40, colorKey: "warning" },
  ],
  achievements: [
    { icon: "sparkles-outline", title: "Crear tu primer objetivo", detail: "Desbloqueado", progress: 1, xp: 25, colorKey: "xp" },
    { icon: "calendar-outline", title: "Registrar 7 días seguidos", detail: "3/7", progress: 3 / 7, xp: 50, colorKey: "coral" },
  ],
}

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme()
  const { userProfile } = useAuth()
  const [expandedGroups, setExpandedGroups] = useState({ daily: true, weekly: true, achievements: true })
  const [completedGroups, setCompletedGroups] = useState({})

  const toggleGroup = (group) => {
    setExpandedGroups((current) => ({ ...current, [group]: !current[group] }))
  }

  const toggleCompleted = (group) => {
    setCompletedGroups((current) => ({ ...current, [group]: !current[group] }))
  }

  const renderMissions = (group) => {
    const groupMissions = missions[group]
    const hasCompleted = groupMissions.some((mission) => mission.progress >= 1)
    const visibleMissions = groupMissions
      .slice()
      .sort((a, b) => Number(a.progress >= 1) - Number(b.progress >= 1))
      .filter((mission) => completedGroups[group] || mission.progress < 1)

    if (!expandedGroups[group]) return null

    return (
      <>
        {visibleMissions.map((mission) => (
          <MissionCard key={mission.title} {...mission} color={theme.colors[mission.colorKey]} />
        ))}
        {hasCompleted && (
          <Pressable onPress={() => toggleCompleted(group)} style={styles.completedButton} accessibilityRole="button" accessibilityLabel={`${completedGroups[group] ? "Ocultar" : "Mostrar"} misiones completadas`}>
            <Ionicons name={completedGroups[group] ? "eye-off-outline" : "eye-outline"} size={15} color={theme.textSecondary} />
            <Text style={[styles.completedButtonText, { color: theme.textSecondary }]}>
              {completedGroups[group] ? "Ocultar completadas" : "Ver completadas"}
            </Text>
          </Pressable>
        )}
      </>
    )
  }

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

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Retos activos</Text>
        <Card variant="default" style={styles.missionsCard}>
          <Pressable onPress={() => toggleGroup("daily")} style={styles.missionHeader} accessibilityRole="button" accessibilityLabel="Mostrar misiones diarias" accessibilityState={{ expanded: !!expandedGroups.daily }}>
            <Text style={[styles.missionGroupTitle, { color: theme.text }]}>Diarias</Text>
            <View style={styles.missionHeaderRight}>
              <Badge variant="primary" size="sm">Hoy</Badge>
              <Ionicons name={expandedGroups.daily ? "chevron-up" : "chevron-down"} size={18} color={theme.textSecondary} />
            </View>
          </Pressable>
          {renderMissions("daily")}
        </Card>
        <Card variant="default" style={styles.missionsCard}>
          <Pressable onPress={() => toggleGroup("weekly")} style={styles.missionHeader} accessibilityRole="button" accessibilityLabel="Mostrar misiones semanales" accessibilityState={{ expanded: !!expandedGroups.weekly }}>
            <Text style={[styles.missionGroupTitle, { color: theme.text }]}>Semanales</Text>
            <View style={styles.missionHeaderRight}>
              <Badge variant="accent" size="sm">Esta semana</Badge>
              <Ionicons name={expandedGroups.weekly ? "chevron-up" : "chevron-down"} size={18} color={theme.textSecondary} />
            </View>
          </Pressable>
          {renderMissions("weekly")}
        </Card>
        <Card variant="default" style={styles.missionsCard}>
          <Pressable onPress={() => toggleGroup("achievements")} style={styles.missionHeader} accessibilityRole="button" accessibilityLabel="Mostrar logros" accessibilityState={{ expanded: !!expandedGroups.achievements }}>
            <Text style={[styles.missionGroupTitle, { color: theme.text }]}>Logros</Text>
            <View style={styles.missionHeaderRight}>
              <Badge variant="xp" size="sm">Únicos</Badge>
              <Ionicons name={expandedGroups.achievements ? "chevron-up" : "chevron-down"} size={18} color={theme.textSecondary} />
            </View>
          </Pressable>
          {renderMissions("achievements")}
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Acceso rápido
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
  missionsCard: {
    marginBottom: 16,
  },
  missionGroup: {
    marginBottom: 10,
  },
  missionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  missionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  missionGroupTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  completedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingTop: 9,
  },
  completedButtonText: {
    fontSize: 11,
    fontWeight: "700",
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
