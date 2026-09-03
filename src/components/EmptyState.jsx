import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useEffect } from "react"
import Button from "./Button"
import { useTheme } from "../contexts/ThemeContext"

export default function EmptyState({
  icon = "folder-open-outline",
  title,
  description,
  actionLabel,
  onAction,
  style,
}) {
  const { theme } = useTheme()
  const bounce = useSharedValue(0)

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }))

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Ionicons
          name={icon}
          size={64}
          color={theme.textSecondary}
        />
      </Animated.View>
      <Text style={[styles.title, { color: theme.text }]}>
        {title}
      </Text>
      {description && (
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
})
