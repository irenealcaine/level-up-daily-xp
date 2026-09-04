import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import ProgressBar from "./ProgressBar"

export default function MissionCard({ icon, title, progress = 0, detail, xp, color }) {
  const { theme } = useTheme()
  const completed = progress >= 1
  const missionColor = completed ? theme.textSecondary : (color || theme.colors.primary)

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={[styles.icon, { backgroundColor: missionColor }]}> 
        <Ionicons name={completed ? "checkmark" : icon} size={16} color="#ffffff" />
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.xp, { color: completed ? theme.textSecondary : theme.colors.xp }]}>+{xp} XP</Text>
        </View>
        <View style={styles.progressRow}>
          <ProgressBar progress={progress} color={missionColor} height={5} animated={false} style={styles.progressBar} />
          <Text style={[styles.detail, { color: theme.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">{detail}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  xp: {
    fontSize: 11,
    fontWeight: "800",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  progressBar: {
    flex: 1,
    width: "auto",
  },
  detail: {
    fontSize: 11,
    maxWidth: 78,
    flexShrink: 1,
    textAlign: "right",
  },
})
