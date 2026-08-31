import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "./src/contexts/ThemeContext"
import AppNavigator from "./src/navigation/AppNavigator"

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
