import { useEffect, useState } from "react"
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { getShoppingItems, saveShoppingItems } from "../services/shoppingService"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"

export default function Section3Screen() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [items, setItems] = useState(null)
  const [itemName, setItemName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user?.uid) return

    getShoppingItems(user.uid)
      .then(setItems)
      .catch(() => {
        setItems([])
        setError("No se ha podido cargar la lista de la compra")
      })
  }, [user?.uid])

  const persist = async (nextItems) => {
    setItems(nextItems)
    try {
      await saveShoppingItems(user.uid, nextItems)
    } catch (saveError) {
      setError("No se han podido guardar los cambios")
    }
  }

  const addItem = () => {
    const name = itemName.trim()
    if (!name) {
      setError("Escribe un producto")
      return
    }

    persist([...items, { id: `${Date.now()}`, name, completed: false }])
    setItemName("")
    setError("")
  }

  const toggleItem = (item) => {
    persist(items.map((current) => current.id === item.id ? { ...current, completed: !current.completed } : current))
  }

  const deleteItem = (item) => {
    const remove = () => persist(items.filter((current) => current.id !== item.id))
    const message = `¿Quieres eliminar “${item.name}”?`

    if (Platform.OS === "web") {
      if (window.confirm(message)) remove()
      return
    }

    Alert.alert("Eliminar producto", message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: remove },
    ])
  }

  if (items === null) {
    return <View style={[styles.container, { backgroundColor: theme.background }]} />
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.icon, { backgroundColor: theme.colors.coral }]}>
        <Ionicons name="cart-outline" size={32} color="#ffffff" />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Compras</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Apunta lo que necesitas y táchalo al encontrarlo.</Text>

      <Card variant="elevated" style={styles.addCard}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Añadir a la lista</Text>
        <View style={styles.addRow}>
          <Input placeholder="Ej. Leche" value={itemName} onChangeText={setItemName} icon="cart-outline" style={styles.input} />
          <Button variant="secondary" size="md" onPress={addItem} icon="add-outline">Añadir</Button>
        </View>
        {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}
      </Card>

      <Text style={[styles.listTitle, { color: theme.text }]}>Lista de la compra</Text>
      {items.length === 0 ? (
        <Card variant="default" style={styles.emptyCard}>
          <Ionicons name="basket-outline" size={28} color={theme.colors.coral} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>La lista está vacía</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Añade algo para empezar.</Text>
        </Card>
      ) : (
        items.map((item) => (
          <Card key={item.id} variant="default" style={styles.itemCard}>
            <Pressable onPress={() => toggleItem(item)} style={styles.checkButton} accessibilityRole="checkbox" accessibilityState={{ checked: item.completed }}>
              <Ionicons name={item.completed ? "checkmark-circle" : "ellipse-outline"} size={27} color={item.completed ? theme.colors.success : theme.textSecondary} />
            </Pressable>
            <Text style={[styles.itemName, { color: item.completed ? theme.textSecondary : theme.text }, item.completed && styles.completedItem]}>{item.name}</Text>
            <Pressable onPress={() => deleteItem(item)} accessibilityRole="button" accessibilityLabel={`Eliminar ${item.name}`} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
            </Pressable>
          </Card>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, alignItems: "center" },
  icon: { width: 64, height: 64, borderRadius: 18, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 14, textAlign: "center", marginTop: 4, marginBottom: 16 },
  addCard: { width: "100%", marginBottom: 18 },
  cardTitle: { fontSize: 17, fontWeight: "800", marginBottom: 10 },
  addRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  input: { flex: 1, marginBottom: 0 },
  error: { fontSize: 13, fontWeight: "600", marginTop: 8 },
  listTitle: { width: "100%", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  emptyCard: { width: "100%", alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "800", marginTop: 8 },
  emptyText: { fontSize: 14, marginTop: 4 },
  itemCard: { width: "100%", flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkButton: { marginRight: 10 },
  itemName: { flex: 1, fontSize: 15, fontWeight: "700" },
  completedItem: { textDecorationLine: "line-through" },
  deleteButton: { width: 32, height: 32, borderRadius: 9, justifyContent: "center", alignItems: "center", marginLeft: 8 },
})
