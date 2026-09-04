import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated"
import { useTheme } from "../contexts/ThemeContext"

export default function XPBar({
  currentXP = 0,
  maxXP = 100,
  level = 1,
  showLabel = true,
  height = 12,
  style,
}) {
  const { theme } = useTheme()
  const progress = useSharedValue(0)
  const glow = useSharedValue(0)

  const clampedProgress = Math.min(currentXP / maxXP, 1)

  useEffect(() => {
    progress.value = withTiming(clampedProgress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    })
    glow.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    )
  }, [clampedProgress])

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }))

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.5,
  }))

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.level, { color: theme.colors.xp }]}>
            Nivel {level}
          </Text>
          <Text style={[styles.xp, { color: theme.textSecondary }]}>
            {currentXP} / {maxXP} XP
          </Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.border,
            borderRadius: height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.glow,
            glowStyle,
            {
              height,
              borderRadius: height / 2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.fill,
            fillStyle,
            {
              height,
              borderRadius: height / 2,
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
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  level: {
    fontSize: 16,
    fontWeight: "700",
  },
  xp: {
    fontSize: 14,
    fontWeight: "500",
  },
  track: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  glow: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
              backgroundColor: theme.colors.xp,
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
              backgroundColor: theme.colors.xp,
  },
})
