import { StyleSheet, Text, View, TouchableOpacity } from "react-native"

const sections = [
  { id: "1", title: "Sección 1", screen: "Section1" },
  { id: "2", title: "Sección 2", screen: "Section2" },
  { id: "3", title: "Sección 3", screen: "Section3" },
]

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Selecciona una sección</Text>
      <View style={styles.cards}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={styles.card}
            onPress={() => navigation.navigate(section.screen)}
          >
            <Text style={styles.cardTitle}>{section.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e94560",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 40,
  },
  cards: {
    gap: 16,
  },
  card: {
    backgroundColor: "#16213e",
    padding: 24,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#e94560",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
})
