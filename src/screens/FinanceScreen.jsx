import { useEffect, useMemo, useState } from "react"
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { getFinanceData, saveFinanceData } from "../services/financeService"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"

const currentYear = new Date().getFullYear()
const LOCAL_ENTRIES_KEY = "financeEntries"
const LOCAL_GOAL_KEY = "financeGoal"

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

function GoalForm({ theme, onSave, initialStart = "", initialTarget = "", compact = false }) {
  const [startAmount, setStartAmount] = useState(String(initialStart))
  const [targetAmount, setTargetAmount] = useState(String(initialTarget))
  const [error, setError] = useState("")

  const submit = () => {
    const start = parseAmount(startAmount)
    const target = parseAmount(targetAmount)
    if (!Number.isFinite(start) || !Number.isFinite(target) || start < 0 || target < 0) {
      setError("Introduce dos cantidades válidas")
      return
    }
    setError("")
    onSave({ startAmount: start, targetAmount: target })
  }

  return (
    <Card variant={compact ? "default" : "elevated"} style={styles.formCard}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{compact ? "Configura tu objetivo anual" : "¿Cuál es tu plan de ahorro?"}</Text>
      <Text style={[styles.cardText, { color: theme.textSecondary }]}>Marca desde dónde partes y cuánto te gustaría tener el 31 de diciembre.</Text>
      <Input label="Ahorro al inicio del año" placeholder="Ej. 1250,50" value={startAmount} onChangeText={setStartAmount} keyboardType="decimal-pad" icon="play-outline" />
      <Input label="Objetivo al final del año" placeholder="Ej. 3000" value={targetAmount} onChangeText={setTargetAmount} keyboardType="decimal-pad" icon="flag-outline" />
      {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}
      <Button variant={compact ? "secondary" : "primary"} size="lg" onPress={submit} icon="trending-up-outline">
        {compact ? "Guardar objetivo" : "Crear mi gráfico"}
      </Button>
    </Card>
  )
}

export default function FinanceScreen() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [entries, setEntries] = useState(null)
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(todayString())
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [goal, setGoal] = useState(null)
  const { width } = useWindowDimensions()
  const [chartWidth, setChartWidth] = useState(width - 80)

  useEffect(() => {
    if (!user?.uid) return

    getFinanceData(user.uid)
      .then(async ({ entries: storedEntries, goal: storedGoal }) => {
        const [localEntries, localGoal] = await Promise.all([
          AsyncStorage.getItem(LOCAL_ENTRIES_KEY),
          AsyncStorage.getItem(LOCAL_GOAL_KEY),
        ])
        const migratedEntries = storedEntries.length === 0 && localEntries ? JSON.parse(localEntries) : storedEntries
        const migratedGoal = !storedGoal && localGoal ? JSON.parse(localGoal) : storedGoal
        setEntries(migratedEntries)
        setGoal(migratedGoal)
        if (migratedEntries !== storedEntries || migratedGoal !== storedGoal) {
          await saveFinanceData(user.uid, migratedEntries, migratedGoal)
          await AsyncStorage.multiRemove([LOCAL_ENTRIES_KEY, LOCAL_GOAL_KEY])
        }
      })
      .catch(() => {
        setEntries([])
        setGoal(null)
        setError("No se han podido cargar tus datos financieros")
      })
  }, [user?.uid])

  const saveEntries = (nextEntries) => {
    const sortedEntries = [...nextEntries].sort((a, b) => a.date.localeCompare(b.date))
    setEntries(sortedEntries)
    return saveFinanceData(user.uid, sortedEntries, goal).catch(() => {
      setError("No se han podido guardar los cambios")
    })
  }

  const saveGoal = (nextGoal) => {
    setGoal(nextGoal)
    return saveFinanceData(user.uid, entries, nextGoal).catch(() => {
      setError("No se ha podido guardar el objetivo")
    })
  }

  const createInitialPlan = (nextGoal) => {
    const initialEntries = [{ id: `${Date.now()}`, amount: nextGoal.startAmount, date: `${currentYear}-01-01` }]
    setGoal(nextGoal)
    setEntries(initialEntries)
    saveFinanceData(user.uid, initialEntries, nextGoal).catch(() => {
      setError("No se ha podido guardar tu información financiera")
    })
  }

  const updateGoal = (nextGoal) => {
    saveGoal(nextGoal)
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
  const chartValues = [
    ...chartEntries.map((entry) => entry.amount),
    ...(goal ? [goal.startAmount, goal.targetAmount] : []),
  ]
  const minAmount = Math.min(...chartValues)
  const maxAmount = Math.max(...chartValues)
  const chartRange = Math.max(maxAmount - minAmount, 1)
  const chartHeight = 210
  const getPlotPoint = (date, amount) => ({
    x: 10 + ((getDayOfYear(date) - 1) / 364) * Math.max(chartWidth - 20, 1),
    y: chartHeight - 20 - ((amount - minAmount) / chartRange) * (chartHeight - 40),
  })
  const chartPoints = chartEntries.map((entry) => ({ ...entry, ...getPlotPoint(entry.date, entry.amount) }))
  const guidePoints = goal
    ? [getPlotPoint(`${currentYear}-01-01`, goal.startAmount), getPlotPoint(`${currentYear}-12-31`, goal.targetAmount)]
    : []

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
        <GoalForm theme={theme} onSave={createInitialPlan} />
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

      {!goal && <GoalForm theme={theme} compact onSave={updateGoal} initialStart={chartEntries[0].amount} />}

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
          <Text style={[styles.yLabel, styles.yLabelTop, { color: theme.textSecondary, backgroundColor: theme.surface }]}>{formatMoney(maxAmount)}</Text>
          <Text style={[styles.yLabel, styles.yLabelBottom, { color: theme.textSecondary, backgroundColor: theme.surface }]}>{formatMoney(minAmount)}</Text>
          {[0, 1, 2, 3, 4].map((line) => (
            <View key={line} style={[styles.gridLine, { top: line * 42, borderTopColor: theme.border }]} />
          ))}
          {guidePoints.length === 2 && (() => {
            const [start, end] = guidePoints
            const length = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)
            const angle = Math.atan2(end.y - start.y, end.x - start.x)
            return <View style={[styles.chartLine, styles.guideLine, { left: start.x, top: start.y - 1.5, width: length, backgroundColor: theme.colors.primary, transform: [{ rotate: `${angle}rad` }] }]} />
          })()}
          {chartPoints.slice(1).map((point, index) => {
            const previous = chartPoints[index]
            const length = Math.sqrt((point.x - previous.x) ** 2 + (point.y - previous.y) ** 2)
            const angle = Math.atan2(point.y - previous.y, point.x - previous.x)
            return <View key={`${previous.id}-${point.id}`} style={[styles.chartLine, { left: previous.x, top: previous.y - 1.5, width: length, backgroundColor: theme.colors.coral, transform: [{ rotate: `${angle}rad` }] }]} />
          })}
          {chartPoints.map((point) => (
            <View key={point.id} style={[styles.chartPoint, { left: point.x - 2, top: point.y - 2, backgroundColor: theme.colors.coral }]} />
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

      {goal && <View style={styles.goalLink}>
        <Ionicons name="flag-outline" size={16} color={theme.colors.primary} />
        <Text style={[styles.goalLinkText, { color: theme.colors.primary }]}>Objetivo: {formatMoney(goal.targetAmount)} al final del año</Text>
      </View>}

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
  content: { padding: 20, paddingBottom: 32 },
  emptyContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  heroIcon: { width: 78, height: 78, borderRadius: 22, justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 18 },
  heroIconSmall: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  headingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 16 },
  formCard: { width: "100%", marginTop: 12 },
  cardTitle: { fontSize: 17, fontWeight: "800", marginBottom: 6 },
  cardText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  error: { fontSize: 13, fontWeight: "600", marginBottom: 14 },
  formActions: { gap: 8, alignItems: "flex-start" },
  chartCard: { width: "100%", paddingBottom: 12 },
  chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  chartLabel: { fontSize: 13, fontWeight: "600" },
  total: { fontSize: 24, fontWeight: "800", marginTop: 2 },
  chart: { height: 210, width: "100%", position: "relative", borderBottomWidth: 2 },
  yLabel: { position: "absolute", left: 4, zIndex: 2, fontSize: 10, fontWeight: "700", paddingHorizontal: 2 },
  yLabelTop: { top: 2 },
  yLabelBottom: { bottom: 2 },
  gridLine: { position: "absolute", left: 0, right: 0, borderTopWidth: 1, borderStyle: "dashed" },
  chartLine: { position: "absolute", height: 3, transformOrigin: "left center", borderRadius: 2 },
  guideLine: { opacity: 0.35 },
  chartPoint: { position: "absolute", width: 4, height: 4, borderRadius: 2 },
  chartAxis: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  axisText: { fontSize: 12, fontWeight: "600" },
  historyTitle: { fontSize: 18, fontWeight: "800", marginTop: 20, marginBottom: 4 },
  historyRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1 },
  historyDate: { fontSize: 14 },
  historyAmount: { fontSize: 16, fontWeight: "800", marginBottom: 3 },
  historyActions: { flexDirection: "row", gap: 8 },
  actionButton: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  goalLink: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 16 },
  goalLinkText: { fontSize: 13, fontWeight: "700" },
})
