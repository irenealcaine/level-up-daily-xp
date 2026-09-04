import { useEffect, useMemo, useState } from "react"
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"

const STORAGE_KEY = "financeEntries"
const currentYear = new Date().getFullYear()

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function parseAmount(value) {
  return Number.parseFloat(value.replace(",", "."))
}

function formatMoney(value) {
  return `${value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

function getDayOfYear(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  const start = new Date(date.getFullYear(), 0, 1)
  return Math.floor((date - start) / 86400000) + 1
}

export default function FinanceScreen() {
  const { theme } = useTheme()
  const [entries, setEntries] = useState(null)
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(todayString())
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const { width } = useWindowDimensions()
  const [chartWidth, setChartWidth] = useState(width - 80)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => setEntries(stored ? JSON.parse(stored) : []))
      .catch(() => setEntries([]))
  }, [])

  const saveEntries = (nextEntries) => {
    const sortedEntries = [...nextEntries].sort((a, b) => a.date.localeCompare(b.date))
    setEntries(sortedEntries)
    return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sortedEntries))
  }

  const saveEntry = () => {
    setError("")
    const parsedAmount = parseAmount(amount)

    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      setError("Introduce una cantidad válida")
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(`${date}T00:00:00`).getFullYear() !== currentYear) {
      setError(`La fecha debe estar en ${currentYear} y usar el formato AAAA-MM-DD`)
      return
    }

    const nextEntries = editingId
      ? entries.map((entry) => entry.id === editingId ? { ...entry, amount: parsedAmount, date } : entry)
      : [...entries, { id: `${Date.now()}`, amount: parsedAmount, date }]

    saveEntries(nextEntries)
    setAmount("")
    setDate(todayString())
    setEditingId(null)
  }

  const startEditing = (entry) => {
    setEditingId(entry.id)
    setAmount(String(entry.amount).replace(".", ","))
    setDate(entry.date)
    setError("")
  }

  const cancelEditing = () => {
    setEditingId(null)
    setAmount("")
    setDate(todayString())
    setError("")
  }

  const deleteEntry = (entry) => {
    const remove = () => {
      saveEntries(entries.filter((item) => item.id !== entry.id))
      if (editingId === entry.id) cancelEditing()
    }
    const message = `¿Quieres eliminar el ahorro de ${formatMoney(entry.amount)} del ${entry.date}?`

    if (Platform.OS === "web") {
      if (window.confirm(message)) remove()
      return
    }

    Alert.alert("Eliminar movimiento", message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: remove },
    ])
  }

  const chartEntries = useMemo(() => entries || [], [entries])
  const maxAmount = Math.max(...chartEntries.map((entry) => entry.amount), 1)
  const chartHeight = 210
  const chartPoints = chartEntries.map((entry) => ({
    ...entry,
    x: 10 + ((getDayOfYear(entry.date) - 1) / 364) * Math.max(chartWidth - 20, 1),
    y: chartHeight - 20 - (entry.amount / maxAmount) * (chartHeight - 40),
  }))

  if (entries === null) {
    return <View style={[styles.container, { backgroundColor: theme.background }]} />
  }

  if (entries.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.emptyContent} style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.heroIcon, { backgroundColor: theme.colors.coral }]}>
          <Ionicons name="wallet-outline" size={38} color="#ffffff" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Tu dinero, a tu ritmo</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Empezamos con una cifra y vamos viendo cómo evoluciona.</Text>
        <Card variant="elevated" style={styles.formCard}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>¿Cuánto tienes ahorrado?</Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>Será tu punto de partida para este año.</Text>
          <Input
            label="Ahorro actual"
            placeholder="Ej. 1250,50"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            icon="cash-outline"
          />
          {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}
          <Button variant="primary" size="lg" onPress={saveEntry} icon="trending-up-outline">
            Crear mi gráfico
          </Button>
        </Card>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headingRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Mis finanzas</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Así va tu ahorro en {currentYear}.</Text>
        </View>
        <View style={[styles.heroIconSmall, { backgroundColor: theme.colors.coral }]}>
          <Ionicons name="wallet-outline" size={25} color="#ffffff" />
        </View>
      </View>

      <Card variant="elevated" style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>Ahorro registrado</Text>
            <Text style={[styles.total, { color: theme.text }]}>{formatMoney(chartEntries[chartEntries.length - 1].amount)}</Text>
          </View>
          <Ionicons name="stats-chart-outline" size={28} color={theme.colors.coral} />
        </View>
        <View
          style={[styles.chart, { borderBottomColor: theme.border }]}
          onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
        >
          {[0, 1, 2, 3, 4].map((line) => (
            <View key={line} style={[styles.gridLine, { top: line * 42, borderTopColor: theme.border }]} />
          ))}
          {chartPoints.slice(1).map((point, index) => {
            const previous = chartPoints[index]
            const length = Math.sqrt((point.x - previous.x) ** 2 + (point.y - previous.y) ** 2)
            const angle = Math.atan2(point.y - previous.y, point.x - previous.x)
            return <View key={`${previous.id}-${point.id}`} style={[styles.chartLine, { left: previous.x, top: previous.y - 1.5, width: length, backgroundColor: theme.colors.coral, transform: [{ rotate: `${angle}rad` }] }]} />
          })}
          {chartPoints.map((point) => (
            <View key={point.id} style={[styles.chartPoint, { left: point.x - 6, top: point.y - 6, backgroundColor: theme.colors.coral, borderColor: theme.surface }]} />
          ))}
        </View>
        <View style={styles.chartAxis}>
          <Text style={[styles.axisText, { color: theme.textSecondary }]}>Ene</Text>
          <Text style={[styles.axisText, { color: theme.textSecondary }]}>Jun</Text>
          <Text style={[styles.axisText, { color: theme.textSecondary }]}>Dic</Text>
        </View>
      </Card>

      <Card variant="default" style={styles.formCard}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{editingId ? "Editar movimiento" : "Añadir movimiento"}</Text>
        <Text style={[styles.cardText, { color: theme.textSecondary }]}>Apunta cómo cambia tu ahorro.</Text>
        <Input label="Cantidad ahorrada" placeholder="Ej. 1500" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" icon="cash-outline" />
        <Input label="Fecha" placeholder="AAAA-MM-DD" value={date} onChangeText={setDate} icon="calendar-outline" />
        {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}
        <View style={styles.formActions}>
          <Button variant="secondary" size="md" onPress={saveEntry} icon={editingId ? "checkmark-outline" : "add-outline"}>
            {editingId ? "Guardar cambios" : "Guardar movimiento"}
          </Button>
          {editingId && <Button variant="ghost" size="sm" onPress={cancelEditing}>Cancelar</Button>}
        </View>
      </Card>

      <Text style={[styles.historyTitle, { color: theme.text }]}>Historial</Text>
      {chartEntries.slice().reverse().map((entry) => (
        <View key={entry.id} style={[styles.historyRow, { borderBottomColor: theme.border }]}> 
          <View>
            <Text style={[styles.historyAmount, { color: theme.text }]}>{formatMoney(entry.amount)}</Text>
            <Text style={[styles.historyDate, { color: theme.textSecondary }]}>{entry.date}</Text>
          </View>
          <View style={styles.historyActions}>
            <Pressable onPress={() => startEditing(entry)} accessibilityRole="button" accessibilityLabel={`Editar movimiento del ${entry.date}`} style={styles.actionButton}>
              <Ionicons name="pencil-outline" size={19} color={theme.colors.primary} />
            </Pressable>
            <Pressable onPress={() => deleteEntry(entry)} accessibilityRole="button" accessibilityLabel={`Eliminar movimiento del ${entry.date}`} style={styles.actionButton}>
              <Ionicons name="trash-outline" size={19} color={theme.colors.error} />
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 48 },
  emptyContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  heroIcon: { width: 78, height: 78, borderRadius: 22, justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 18 },
  heroIconSmall: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  headingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 16, lineHeight: 23, marginTop: 6, marginBottom: 24 },
  formCard: { width: "100%", marginTop: 18 },
  cardTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  cardText: { fontSize: 15, lineHeight: 22, marginBottom: 18 },
  error: { fontSize: 13, fontWeight: "600", marginBottom: 14 },
  formActions: { gap: 8, alignItems: "flex-start" },
  chartCard: { width: "100%", paddingBottom: 18 },
  chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  chartLabel: { fontSize: 13, fontWeight: "600" },
  total: { fontSize: 28, fontWeight: "800", marginTop: 4 },
  chart: { height: 210, width: "100%", position: "relative", borderBottomWidth: 2 },
  gridLine: { position: "absolute", left: 0, right: 0, borderTopWidth: 1, borderStyle: "dashed" },
  chartLine: { position: "absolute", height: 3, transformOrigin: "left center", borderRadius: 2 },
  chartPoint: { position: "absolute", width: 12, height: 12, borderRadius: 6, borderWidth: 3 },
  chartAxis: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  axisText: { fontSize: 12, fontWeight: "600" },
  historyTitle: { fontSize: 20, fontWeight: "800", marginTop: 28, marginBottom: 8 },
  historyRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1 },
  historyDate: { fontSize: 14 },
  historyAmount: { fontSize: 16, fontWeight: "800", marginBottom: 3 },
  historyActions: { flexDirection: "row", gap: 8 },
  actionButton: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
})
