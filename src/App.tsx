import messaging from "@react-native-firebase/messaging";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Platform, Share } from "react-native";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import NaverLogin from "@react-native-seoul/naver-login";
import { NAVER_APP_NAME, NAVER_URL_SCHEME } from "./lib/naver/naverConfig";
import { FcmTokenSyncBridge } from "./components/internal/FcmTokenSyncBridge";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./navigations/Navigation";
import SplashScreenView from "./screens/OnboardingScreens/SplashScreen/SplashScreen";

// 앱이 background/quit(종료) 상태인 경우 메시지를 받기
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("[Background Message] ", remoteMessage);
});

SplashScreen.preventAutoHideAsync();

const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? "";
if (kakaoNativeAppKey) {
  initializeKakaoSDK(kakaoNativeAppKey);
}

const naverClientId = process.env.EXPO_PUBLIC_NAVER_CLIENT_ID?.trim() ?? "";
const naverClientSecret =
  process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET?.trim() ?? "";
if (
  naverClientId &&
  naverClientSecret &&
  NaverLogin != null &&
  typeof NaverLogin.initialize === "function"
) {
  NaverLogin.initialize({
    appName: NAVER_APP_NAME,
    consumerKey: naverClientId,
    consumerSecret: naverClientSecret,
    serviceUrlSchemeIOS: NAVER_URL_SCHEME,
    disableNaverAppAuthIOS: true,
  });
}

const SPLASH_DURATION_MS = 1000;

const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    if (Platform.OS === "ios") {
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();
    console.log("Authorization Status: ", authorizationStatus);
    console.log("token", token);

    const logToken = process.env.EXPO_PUBLIC_FCM_LOG_TOKEN === "1";
    if (logToken && token) {
      Alert.alert(
        "FCM 토큰 (개발)",
        `${token.slice(0, 32)}...\n\n별도 터미널에서 Metro(npm start)를 켜 두면 같은 내용이 터미널에도 출력됩니다. 공유로 전체 토큰을 복사할 수 있습니다.`,
        [
          { text: "닫기", style: "cancel" },
          {
            text: "공유/복사",
            onPress: () => {
              void Share.share({ message: token, title: "FCM" });
            },
          },
        ],
      );
    }
  }
};

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
    void requestUserPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("[Remote Message] ", JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  if (!isReady) {
    return <SplashScreenView />;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <FcmTokenSyncBridge />
        <StatusBar style="dark" />
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
