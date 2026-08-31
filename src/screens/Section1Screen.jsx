import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

export default function Section1Screen() {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>Sección 1</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
})
