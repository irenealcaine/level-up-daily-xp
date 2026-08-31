import { createDrawerNavigator } from "@react-navigation/drawer"
import HomeScreen from "../screens/HomeScreen"
import Section1Screen from "../screens/Section1Screen"
import Section2Screen from "../screens/Section2Screen"
import Section3Screen from "../screens/Section3Screen"

const Drawer = createDrawerNavigator()

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "#16213e" },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#1a1a2e" },
        drawerActiveTintColor: "#e94560",
        drawerInactiveTintColor: "#aaa",
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Drawer.Screen name="Section1" component={Section1Screen} options={{ title: "Sección 1" }} />
      <Drawer.Screen name="Section2" component={Section2Screen} options={{ title: "Sección 2" }} />
      <Drawer.Screen name="Section3" component={Section3Screen} options={{ title: "Sección 3" }} />
    </Drawer.Navigator>
  )
}
