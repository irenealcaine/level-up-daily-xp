import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme()
  const { register } = useAuth()
  const [nick, setNick] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!nick.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Introduce nick, email y contraseña")
      return
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres")
      return
    }
    setLoading(true)
    try {
      await register(nick.trim(), email.trim(), password)
    } catch (e) {
      Alert.alert("Error", "No se pudo crear la cuenta. Inténtalo de nuevo.")
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
        <Text style={[styles.title, { color: theme.text }]}>Crear cuenta</Text>

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

        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          placeholder="Contraseña"
          placeholderTextColor={theme.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

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
})
