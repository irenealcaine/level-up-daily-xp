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

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme()
  const { register } = useAuth()
  const [nick, setNick] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [registered, setRegistered] = useState(false)

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
            <Ionicons name="mail-open-outline" size={64} color={theme.text} style={styles.successIcon} />
            <Text style={[styles.title, { color: theme.text, textAlign: "center" }]}>¡Cuenta creada!</Text>
            <Text style={[styles.successText, { color: theme.textSecondary }]}>
              Hemos enviado un email de verificación a {email}. Revisa tu bandeja de entrada y confirma tu correo para poder iniciar sesión.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.link, { color: theme.link }]}>
                Volver al inicio de sesión
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.title, { color: theme.text }]}>Crear cuenta</Text>

            {error ? <Text style={[styles.error, { color: theme.error || "#ff3b30" }]}>{error}</Text> : null}

            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="Nick de usuario"
              placeholderTextColor={theme.textSecondary}
              value={nick}
              onChangeText={setNick}
              autoCapitalize="none"
            />

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

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Repetir contraseña"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={22}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.text }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: theme.background }]}>
                {loading ? "Creando..." : "Registrarse"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.link, { color: theme.link }]}>
                ¿Ya tienes cuenta? Inicia sesión
              </Text>
            </TouchableOpacity>
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
  successIcon: {
    marginBottom: 24,
    alignSelf: "center",
  },
  successText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
})
