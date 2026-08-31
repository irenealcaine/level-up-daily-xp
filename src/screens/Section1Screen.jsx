import { StyleSheet, Text, View } from "react-native"

export default function Section1Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sección 1</Text>
      <Text style={styles.text}>Contenido de la sección 1</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e94560",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#aaa",
  },
})
