import { StyleSheet, Pressable } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { useTheme } from "../contexts/ThemeContext"

export default function Card({
  variant = "default",
  onPress,
  style,
  children,
}) {
  const { theme } = useTheme()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 })
    }
  }

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 })
    }
  }

  const getContainerStyle = () => {
    const base = {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    }

    switch (variant) {
      case "default":
        return {
          ...base,
          backgroundColor: theme.surface,
          borderWidth: 2,
          borderColor: theme.cardBorder,
        }
      case "elevated":
        return {
          ...base,
          backgroundColor: theme.surfaceElevated,
          borderWidth: 2,
          borderColor: theme.cardBorder,
        }
      case "outlined":
        return {
          ...base,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.border,
        }
      default:
        return base
    }
  }

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <Pressable
          style={getContainerStyle()}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={[getContainerStyle(), style]}>
      {children}
    </Animated.View>
  )
}
