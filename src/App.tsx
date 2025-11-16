import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import Navigation from "./navigations/Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;
