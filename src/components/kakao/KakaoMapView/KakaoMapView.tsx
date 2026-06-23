import { useMemo } from "react";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../../color";
import {
  getKakaoMapLink,
  isWebViewNativeModuleAvailable,
} from "../../../lib/kakao/webViewAvailable";
import styles from "./styles";

const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim() ?? "";

type KakaoMapViewProps = {
  latitude: number;
  longitude: number;
  height?: number;
};

function buildMapHtml(latitude: number, longitude: number, appKey: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
  </style>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false"></script>
</head>
<body>
  <div id="map"></div>
  <script>
    kakao.maps.load(function () {
      var center = new kakao.maps.LatLng(${latitude}, ${longitude});
      var map = new kakao.maps.Map(document.getElementById('map'), {
        center: center,
        level: 3
      });
      new kakao.maps.Marker({ position: center, map: map });
    });
  </script>
</body>
</html>`;
}

function KakaoMapFallback({
  latitude,
  longitude,
  height,
  message,
}: {
  latitude: number;
  longitude: number;
  height: number;
  message: string;
}) {
  const openMap = async () => {
    const url = getKakaoMapLink(latitude, longitude);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("알림", "지도를 열 수 없습니다.");
    }
  };

  return (
    <Pressable
      style={[styles.fallback, { height }]}
      onPress={openMap}
    >
      <MaterialCommunityIcons
        name="map-marker-radius"
        size={32}
        color={MAIN.DEFAULT}
      />
      <Text style={styles.fallbackMessage}>{message}</Text>
      <View style={styles.fallbackButton}>
        <Text style={styles.fallbackButtonText}>카카오맵에서 보기</Text>
      </View>
    </Pressable>
  );
}

function KakaoMapWebView({
  height,
  html,
}: {
  height: number;
  html: string;
}) {
  const { WebView } = require("react-native-webview") as typeof import("react-native-webview");

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

export default function KakaoMapView({
  latitude,
  longitude,
  height = 180,
}: KakaoMapViewProps) {
  const html = useMemo(
    () => buildMapHtml(latitude, longitude, KAKAO_JS_KEY),
    [latitude, longitude],
  );

  const webViewReady = isWebViewNativeModuleAvailable();

  if (!webViewReady) {
    return (
      <KakaoMapFallback
        latitude={latitude}
        longitude={longitude}
        height={height}
        message={
          "앱 내 지도는 네이티브 빌드 후 사용할 수 있습니다.\n(npx expo run:ios 또는 run:android)"
        }
      />
    );
  }

  if (!KAKAO_JS_KEY) {
    return (
      <KakaoMapFallback
        latitude={latitude}
        longitude={longitude}
        height={height}
        message="EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY를 설정하면 앱 안에서 지도가 표시됩니다."
      />
    );
  }

  return (
    <KakaoMapWebView height={height} html={html} />
  );
}
