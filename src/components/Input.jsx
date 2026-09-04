import { useState } from "react"
import { StyleSheet, Text, View, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

export default function Input({
  label,
  error,
  icon,
  rightElement,
  style,
  ...props
}) {
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
  }

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: focused ? theme.colors.primary : error ? theme.colors.error : theme.border }]}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={focused ? theme.colors.primary : theme.textSecondary}
              style={styles.icon}
            />
          )}
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholderTextColor={theme.textSecondary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightElement && (
            <View style={styles.rightElement}>
              {rightElement}
            </View>
          )}
        </View>
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    paddingRight: 32,
  },
  rightElement: {
    position: "absolute",
    right: 8,
  },
  error: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
})
