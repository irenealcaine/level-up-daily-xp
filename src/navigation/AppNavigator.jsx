import { ActivityIndicator, View } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import HomeScreen from "../screens/HomeScreen"
import Section1Screen from "../screens/Section1Screen"
import Section2Screen from "../screens/Section2Screen"
import Section3Screen from "../screens/Section3Screen"
import SettingsScreen from "../screens/SettingsScreen"

const Drawer = createDrawerNavigator()
const Stack = createNativeStackNavigator()

function AuthStack() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

function AppDrawer() {
  const { theme } = useTheme()

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBg,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        drawerStyle: {
          backgroundColor: theme.drawerBg,
          width: 260,
        },
        drawerActiveTintColor: theme.drawerActive,
        drawerInactiveTintColor: theme.drawerInactive,
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "500",
          marginLeft: -4,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 12,
          marginVertical: 2,
        },
        drawerActiveBackgroundColor: theme.surface,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Drawer.Screen name="Section1" component={Section1Screen} options={{ title: "Sección 1" }} />
      <Drawer.Screen name="Section2" component={Section2Screen} options={{ title: "Sección 2" }} />
      <Drawer.Screen name="Section3" component={Section3Screen} options={{ title: "Sección 3" }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: "Ajustes" }} />
    </Drawer.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    )
  }

  return user ? <AppDrawer /> : <AuthStack />
}
