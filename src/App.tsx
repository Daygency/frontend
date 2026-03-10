import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigations/Navigation";
import SplashScreenView from "./components/SplashScreen/SplashScreen";

SplashScreen.preventAutoHideAsync();

const SPLASH_DURATION_MS = 1000;

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.hideAsync();
    };
    prepare();

    const timer = setTimeout(() => setIsReady(true), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SplashScreenView />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;
