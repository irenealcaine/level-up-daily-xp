import { useState } from "react"
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import Input from "../components/Input"
import PasswordInput from "../components/PasswordInput"
import Button from "../components/Button"

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme()
  const { register } = useAuth()
  const [nick, setNick] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [registered, setRegistered] = useState(false)

  const iconScale = useSharedValue(1)

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }))

  async function handleRegister() {
    setError("")
    if (!nick.trim() || !email.trim() || !password.trim()) {
      setError("Introduce nick, email y contraseña")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Introduce un email válido")
      return
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    setLoading(true)
    try {
      await register(nick.trim(), email.trim(), password)
      iconScale.value = withSpring(1.2, { damping: 10, stiffness: 200 }, () => {
        iconScale.value = withSpring(1, { damping: 10, stiffness: 200 })
      })
      setRegistered(true)
    } catch (e) {
      setError("No se pudo crear la cuenta. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        {registered ? (
          <>
            <Animated.View style={[styles.iconContainer, iconStyle]}>
              <Ionicons name="mail-open-outline" size={64} color={theme.colors.primary} />
            </Animated.View>
            <Text style={[styles.title, { color: theme.text, textAlign: "center" }]}>
              ¡Cuenta creada!
            </Text>
            <Text style={[styles.successText, { color: theme.textSecondary }]}>
              Hemos enviado un email de verificación a {email}. Revisa tu bandeja de entrada y confirma tu correo para poder iniciar sesión.
            </Text>
            <Button
              variant="primary"
              size="lg"
              onPress={() => navigation.navigate("Login")}
              icon="arrow-back-outline"
              style={styles.button}
            >
              Volver al inicio de sesión
            </Button>
          </>
        ) : (
          <>
            <Text style={[styles.title, { color: theme.text }]}>Crear cuenta</Text>

            {error ? (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {error}
              </Text>
            ) : null}

            <Input
              placeholder="Nick de usuario"
              value={nick}
              onChangeText={setNick}
              autoCapitalize="none"
              icon="person-outline"
            />

            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              icon="mail-outline"
            />

            <PasswordInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
            />

            <PasswordInput
              placeholder="Repetir contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Button
              variant="primary"
              size="lg"
              onPress={handleRegister}
              disabled={loading}
              icon={loading ? "hourglass-outline" : "person-add-outline"}
              style={styles.button}
            >
              {loading ? "Creando..." : "Registrarse"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onPress={() => navigation.goBack()}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 32,
  },
  error: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  successText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
})
