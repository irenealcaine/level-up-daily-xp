import { StyleSheet, Text, Pressable } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

const SIZES = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
  md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16, iconSize: 20 },
  lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18, iconSize: 22 },
}

export default function Button({
  variant = "primary",
  size = "md",
  onPress,
  disabled = false,
  icon,
  children,
  style,
}) {
  const { theme } = useTheme()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 })
  }

  const getContainerStyle = () => {
    const base = {
      paddingVertical: SIZES[size].paddingVertical,
      paddingHorizontal: SIZES[size].paddingHorizontal,
      borderRadius: theme.borderRadius.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.5 : 1,
    }

    switch (variant) {
      case "primary":
        return { ...base, backgroundColor: theme.colors.primary, borderBottomWidth: 4, borderBottomColor: theme.cardBorder }
      case "secondary":
        return { ...base, backgroundColor: theme.colors.accent, borderBottomWidth: 4, borderBottomColor: theme.cardBorder }
      case "outline":
        return { ...base, backgroundColor: "transparent", borderWidth: 2, borderColor: theme.colors.primary, borderBottomWidth: 4 }
      case "ghost":
        return { ...base, backgroundColor: "transparent" }
      default:
        return base
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "primary":
      case "secondary":
        return "#ffffff"
      case "outline":
        return theme.colors.primary
      case "ghost":
        return theme.colors.primary
      default:
        return "#ffffff"
    }
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        style={getContainerStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={SIZES[size].iconSize}
            color={getTextColor()}
            style={{ marginRight: children ? 8 : 0 }}
          />
        )}
        <Text style={{ color: getTextColor(), fontSize: SIZES[size].fontSize, fontWeight: "600" }}>
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  )
}
