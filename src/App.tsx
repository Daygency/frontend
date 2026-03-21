import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import { AuthProvider } from "./contexts/AuthContext";
import { promptPushPermissionOnFirstAppOpen } from "./lib/pushNotifications";
import Navigation from "./navigations/Navigation";
import SplashScreenView from "./screens/OnboardingScreens/SplashScreen/SplashScreen";

SplashScreen.preventAutoHideAsync();

const kakaoNativeAppKey =
  process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? "";
if (kakaoNativeAppKey) {
  initializeKakaoSDK(kakaoNativeAppKey);
}

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

  useEffect(() => {
    if (!isReady) return;
    void promptPushPermissionOnFirstAppOpen();
  }, [isReady]);

  if (!isReady) {
    return <SplashScreenView />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
