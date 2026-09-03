import { useState } from "react"
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from "react-native"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import Input from "../components/Input"
import PasswordInput from "../components/PasswordInput"
import Button from "../components/Button"

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme()
  const { login, resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetSent, setResetSent] = useState(false)

  async function handleLogin() {
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Introduce email y contraseña")
      return
    }
    setLoading(true)
    try {
      await login(email.trim(), password)
    } catch (e) {
      if (e.message === "EMAIL_NOT_VERIFIED") {
        setError("Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.")
      } else {
        setError("Email o contraseña incorrectos")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    setError("")
    setResetSent(false)
    if (!email.trim()) {
      setError("Introduce tu email para recuperar la contraseña")
      return
    }
    try {
      await resetPassword(email.trim())
      setResetSent(true)
    } catch (e) {
      setError("No se pudo enviar el email de recuperación")
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme.text }]}>Iniciar sesión</Text>

        {error ? (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

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

        <Button
          variant="primary"
          size="lg"
          onPress={handleLogin}
          disabled={loading}
          icon={loading ? "hourglass-outline" : "log-in-outline"}
          style={styles.button}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        {resetSent ? (
          <Text style={[styles.success, { color: theme.colors.success }]}>
            Email de recuperación enviado. Revisa tu bandeja de entrada.
          </Text>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onPress={handleResetPassword}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onPress={() => navigation.navigate("Register")}
          style={styles.registerButton}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
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
  success: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 8,
  },
})
