import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme.text }]}>Iniciar sesión</Text>

        {error ? <Text style={[styles.error, { color: theme.error || "#ff3b30" }]}>{error}</Text> : null}

        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Contraseña"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.text }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.link, { color: theme.link }]}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  link: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  error: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
})
