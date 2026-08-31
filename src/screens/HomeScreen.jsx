import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

const sections = [
  { id: "1", title: "Sección 1", screen: "Section1" },
  { id: "2", title: "Sección 2", screen: "Section2" },
  { id: "3", title: "Sección 3", screen: "Section3" },
]

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Inicio</Text>
      <View style={styles.list}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[styles.item, { backgroundColor: theme.surface }]}
            activeOpacity={0.6}
            onPress={() => navigation.navigate(section.screen)}
          >
            <Text style={[styles.itemText, { color: theme.text }]}>{section.title}</Text>
            <Text style={[styles.arrow, { color: theme.textSecondary }]}>›</Text>
          </TouchableOpacity>
        ))}
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
  list: {
    gap: 2,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  itemText: {
    fontSize: 17,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 22,
    fontWeight: "300",
  },
})
