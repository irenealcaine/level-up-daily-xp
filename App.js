import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "./src/contexts/ThemeContext"
import { AuthProvider } from "./src/contexts/AuthContext"
import { ProgressProvider } from "./src/contexts/ProgressContext"
import AppNavigator from "./src/navigation/AppNavigator"

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <ProgressProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
