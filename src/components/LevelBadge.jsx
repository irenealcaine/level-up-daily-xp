import { StyleSheet, Text, View } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useEffect } from "react"
import { useTheme } from "../contexts/ThemeContext"

const SIZES = {
  sm: { container: 40, text: 16, border: 3 },
  md: { container: 56, text: 22, border: 4 },
  lg: { container: 72, text: 28, border: 4 },
}

export default function LevelBadge({
  level = 1,
  size = "md",
  animated = false,
  style,
}) {
  const { theme } = useTheme()
  const scale = useSharedValue(1)
  const sizeConfig = SIZES[size]

  useEffect(() => {
    if (animated) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 10, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        ),
        2,
        true
      )
    }
  }, [animated])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const getLevelColor = () => {
    if (level >= 50) return theme.colors.xp
    if (level >= 30) return theme.colors.primary
    if (level >= 15) return theme.colors.accent
    return theme.colors.success
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: sizeConfig.container,
          height: sizeConfig.container,
          borderRadius: sizeConfig.container / 2,
          borderWidth: sizeConfig.border,
          borderColor: getLevelColor(),
        },
        animatedStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.level,
          {
            fontSize: sizeConfig.text,
            color: getLevelColor(),
          },
        ]}
      >
        {level}
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  level: {
    fontWeight: "800",
  },
})
