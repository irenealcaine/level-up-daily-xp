import { useState } from "react"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function PasswordInput({ value, onChangeText, placeholder, theme }) {
  const [visible, setVisible] = useState(false)

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eye}>
        <Ionicons
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={20}
          color={theme.textSecondary}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eye: {
    paddingHorizontal: 14,
  },
})
