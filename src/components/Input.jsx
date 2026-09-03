import { useState } from "react"
import { StyleSheet, Text, View, TextInput } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
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
  const borderAnim = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderAnim.value,
  }))

  const handleFocus = () => {
    setFocused(true)
    borderAnim.value = withSpring(theme.colors.primary, { damping: 15, stiffness: 300 })
  }

  const handleBlur = () => {
    setFocused(false)
    borderAnim.value = withSpring(error ? theme.colors.error : theme.border, { damping: 15, stiffness: 300 })
  }

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? theme.colors.primary : theme.textSecondary}
            style={styles.icon}
          />
        )}
        <Animated.View style={[styles.inputContainer, animatedStyle, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholderTextColor={theme.textSecondary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </Animated.View>
        {rightElement && (
          <View style={styles.rightElement}>
            {rightElement}
          </View>
        )}
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 16,
    padding: 0,
  },
  rightElement: {
    position: "absolute",
    right: 14,
  },
  error: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 6,
  },
})
