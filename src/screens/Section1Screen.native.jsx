import { useEffect, useState } from "react"
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Location from "expo-location"
import MapView, { Marker } from "react-native-maps"
import { useTheme } from "../contexts/ThemeContext"
import Card from "../components/Card"
import Button from "../components/Button"

const initialRegion = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
}

const hasMapApiKey = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY)

export default function Section1Screen() {
  const { theme } = useTheme()
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState("loading")

  const loadLocation = async () => {
    setStatus("loading")

    try {
      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync()

      if (permissionStatus !== "granted") {
        setStatus("denied")
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setLocation(currentLocation.coords)
      setStatus("ready")
    } catch (error) {
      setStatus("error")
    }
  }

  useEffect(() => {
    loadLocation()
  }, [])

  const region = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : initialRegion

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.icon, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="walk-outline" size={34} color="#ffffff" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Pasos y rutas</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Muévete un poco. Suma un montón.</Text>
        <View style={[styles.mapCard, { borderColor: theme.cardBorder }]}>
          {Platform.OS === "web" || !hasMapApiKey ? (
            <View style={[styles.mapFallback, { backgroundColor: theme.surfaceElevated }]}>
              <Ionicons name="map-outline" size={38} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Falta configurar el mapa</Text>
              <Text style={[styles.cardText, { color: theme.textSecondary }]}>Añade la clave de Google Maps para ver tu posición en la APK.</Text>
            </View>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={region}
              region={region}
              showsUserLocation
              showsMyLocationButton
              loadingEnabled
            >
              {location && (
                <Marker coordinate={location} title="Estás aquí" description="Tu posición actual" />
              )}
            </MapView>
          )}
          {status === "loading" && Platform.OS !== "web" && hasMapApiKey && (
            <View style={[styles.statusPill, { backgroundColor: theme.surface }]}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.statusText, { color: theme.text }]}>Buscando tu posición...</Text>
            </View>
          )}
        </View>
        {(status === "denied" || status === "error") && Platform.OS !== "web" && hasMapApiKey && (
          <Card variant="elevated" style={styles.card}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>No hemos encontrado tu posición</Text>
            <Text style={[styles.cardText, { color: theme.textSecondary }]}>Activa el permiso de ubicación para marcarte en el mapa.</Text>
            <Button variant="secondary" size="sm" onPress={loadLocation} style={styles.retryButton} icon="location-outline">
              Intentar de nuevo
            </Button>
          </Card>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 24,
    alignItems: "center",
    flex: 1,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    width: "100%",
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
  },
  mapCard: {
    width: "100%",
    flex: 1,
    minHeight: 360,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
  },
  map: {
    flex: 1,
    minHeight: 360,
  },
  mapFallback: {
    flex: 1,
    minHeight: 360,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    textAlign: "center",
  },
  statusPill: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 16,
  },
})
