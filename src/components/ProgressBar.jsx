import { useEffect } from "react"
import { StyleSheet, View, Text } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { useTheme } from "../contexts/ThemeContext"

export default function ProgressBar({
  progress = 0,
  color,
  height = 8,
  showLabel = false,
  animated = true,
  style,
}) {
  const { theme } = useTheme()
  const width = useSharedValue(0)
  const clampedProgress = Math.min(Math.max(progress, 0), 1)

  useEffect(() => {
    width.value = withTiming(clampedProgress, {
      duration: animated ? 800 : 0,
      easing: Easing.out(Easing.cubic),
    })
  }, [clampedProgress, animated])

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }))

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {Math.round(clampedProgress * 100)}%
        </Text>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.surface,
            borderRadius: height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            fillStyle,
            {
              backgroundColor: color || theme.colors.primary,
              borderRadius: height / 2,
              height,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "right",
  },
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
})
