import { useState } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import Input from "./Input"
import { useTheme } from "../contexts/ThemeContext"

export default function PasswordInput({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  style,
}) {
  const { theme } = useTheme()
  const [visible, setVisible] = useState(false)
  const rotation = useSharedValue(0)

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const toggleVisibility = () => {
    rotation.value = withSpring(visible ? 0 : 180, { damping: 15, stiffness: 300 })
    setVisible(!visible)
  }

  return (
    <Input
      label={label}
      error={error}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!visible}
      autoCapitalize="none"
      style={style}
      rightElement={
        <TouchableOpacity onPress={toggleVisibility} style={styles.eye}>
          <Animated.View style={iconStyle}>
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.textSecondary}
            />
          </Animated.View>
        </TouchableOpacity>
      }
    />
  )
}

const styles = StyleSheet.create({
  eye: {
    padding: 4,
  },
})
