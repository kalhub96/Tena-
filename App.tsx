// @ts-ignore - CSS imports are handled by the bundler, not TypeScript.
import "./src/global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splashscreen from "./src/Splashscreen";
// import Home from "./src/screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={Splashscreen} />
        {/* <Stack.Screen name="Home" component={Home} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}