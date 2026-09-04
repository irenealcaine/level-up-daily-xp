import { useEffect, useState } from "react"
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { getHabits, saveHabits } from "../services/habitsService"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"

export default function Section2Screen() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [habits, setHabits] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user?.uid) return

    getHabits(user.uid)
      .then(setHabits)
      .catch(() => {
        setHabits([])
        setError("No se han podido cargar tus hábitos")
      })
  }, [user?.uid])

  const persist = async (nextHabits) => {
    setHabits(nextHabits)
    try {
      await saveHabits(user.uid, nextHabits)
    } catch (saveError) {
      setError("No se han podido guardar los cambios")
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setEditingId(null)
    setError("")
  }

  const saveHabit = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError("Escribe un nombre para el hábito")
      return
    }

    const nextHabits = editingId
      ? habits.map((habit) => habit.id === editingId ? { ...habit, name: trimmedName, description: description.trim() } : habit)
      : [
          ...habits,
          {
            id: `${Date.now()}`,
            name: trimmedName,
            description: description.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ]

    persist(nextHabits)
    resetForm()
    setShowForm(false)
  }

  const editHabit = (habit) => {
    setEditingId(habit.id)
    setName(habit.name)
    setDescription(habit.description || "")
    setError("")
    setShowForm(true)
  }

  const toggleHabit = (habit) => {
    persist(habits.map((item) => item.id === habit.id ? { ...item, completed: !item.completed } : item))
  }

  const deleteHabit = (habit) => {
    const remove = () => persist(habits.filter((item) => item.id !== habit.id))
    const message = `¿Quieres eliminar “${habit.name}”?`

    if (Platform.OS === "web") {
      if (window.confirm(message)) remove()
      return
    }

    Alert.alert("Eliminar hábito", message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: remove },
    ])
  }

  if (habits === null) {
    return <View style={[styles.container, { backgroundColor: theme.background }]} />
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.icon, { backgroundColor: theme.colors.success }]}>
        <Ionicons name="checkbox-outline" size={32} color="#ffffff" />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Hábitos y tareas</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Pequeños checks. Grandes rachas.</Text>

      {!showForm && (
        <Button variant="secondary" size="md" onPress={() => setShowForm(true)} icon="add-outline" style={styles.newButton}>
          Nuevo hábito
        </Button>
      )}

      {showForm && (
        <Card variant="elevated" style={styles.formCard}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{editingId ? "Editar hábito" : "Nuevo hábito"}</Text>
          <Input label="Nombre" placeholder="Ej. Beber agua" value={name} onChangeText={setName} icon="checkmark-circle-outline" />
          <Input label="Descripción" placeholder="Un pequeño paso cada día" value={description} onChangeText={setDescription} icon="create-outline" />
          {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}
          <View style={styles.formActions}>
            <Button variant="primary" size="md" onPress={saveHabit} icon={editingId ? "checkmark-outline" : "add-outline"}>
              {editingId ? "Guardar cambios" : "Crear hábito"}
            </Button>
            {habits.length > 0 && <Button variant="ghost" size="sm" onPress={() => { resetForm(); setShowForm(false) }}>Cancelar</Button>}
          </View>
        </Card>
      )}

      <Text style={[styles.listTitle, { color: theme.text }]}>Tu lista</Text>
      {error && !showForm ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}
      {habits.length === 0 ? (
        <Card variant="default" style={styles.emptyCard}>
          <Ionicons name="list-outline" size={28} color={theme.colors.success} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Todavía no hay hábitos</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Crea el primero y empieza tu racha.</Text>
        </Card>
      ) : (
        habits.map((habit) => (
          <Card key={habit.id} variant="default" style={styles.habitCard}>
            <Pressable onPress={() => toggleHabit(habit)} style={styles.checkButton} accessibilityRole="checkbox" accessibilityState={{ checked: habit.completed }}>
              <Ionicons name={habit.completed ? "checkmark-circle" : "ellipse-outline"} size={28} color={habit.completed ? theme.colors.success : theme.textSecondary} />
            </Pressable>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitName, { color: habit.completed ? theme.textSecondary : theme.text }]}>{habit.name}</Text>
              {habit.description ? <Text style={[styles.habitDescription, { color: theme.textSecondary }]}>{habit.description}</Text> : null}
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => editHabit(habit)} accessibilityRole="button" accessibilityLabel={`Editar ${habit.name}`} style={styles.actionButton}>
                <Ionicons name="pencil-outline" size={17} color={theme.colors.primary} />
              </Pressable>
              <Pressable onPress={() => deleteHabit(habit)} accessibilityRole="button" accessibilityLabel={`Eliminar ${habit.name}`} style={styles.actionButton}>
                <Ionicons name="trash-outline" size={17} color={theme.colors.error} />
              </Pressable>
            </View>
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
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 16 },
  newButton: { alignSelf: "stretch", marginBottom: 12 },
  formCard: { width: "100%", marginBottom: 18 },
  cardTitle: { fontSize: 17, fontWeight: "800", marginBottom: 10 },
  error: { width: "100%", fontSize: 13, fontWeight: "600", marginBottom: 10 },
  formActions: { alignItems: "flex-start", gap: 6 },
  listTitle: { width: "100%", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  emptyCard: { width: "100%", alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "800", marginTop: 8 },
  emptyText: { fontSize: 14, marginTop: 4 },
  habitCard: { width: "100%", flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkButton: { marginRight: 10 },
  habitInfo: { flex: 1 },
  habitName: { fontSize: 15, fontWeight: "800" },
  habitDescription: { fontSize: 13, marginTop: 3 },
  actions: { flexDirection: "row", gap: 4, marginLeft: 8 },
  actionButton: { width: 32, height: 32, borderRadius: 9, justifyContent: "center", alignItems: "center" },
})
