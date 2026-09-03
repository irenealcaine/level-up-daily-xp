import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

export default function StreakCounter({
  count = 0,
  label = "días consecutivos",
  size = "md",
  style,
}) {
  const { theme } = useTheme()
  const fireScale = useSharedValue(1)

  useEffect(() => {
    if (count > 0) {
      fireScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      )
    }
  }, [count])

  const fireStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }],
  }))

  const isLarge = size === "lg"

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.fireContainer, fireStyle]}>
        <Ionicons
          name="flame"
          size={isLarge ? 48 : 32}
          color={count > 0 ? "#ff6b35" : theme.textSecondary}
        />
      </Animated.View>
      <Text
        style={[
          styles.count,
          {
            fontSize: isLarge ? 48 : 32,
            color: count > 0 ? theme.text : theme.textSecondary,
          },
        ]}
      >
        {count}
      </Text>
      <Text
        style={[
          styles.label,
          {
            fontSize: isLarge ? 16 : 14,
            color: theme.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  fireContainer: {
    marginBottom: 8,
  },
  count: {
    fontWeight: "700",
    letterSpacing: -1,
  },
  label: {
    fontWeight: "500",
    marginTop: 4,
  },
})
