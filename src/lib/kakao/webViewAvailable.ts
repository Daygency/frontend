import { NativeModules } from "react-native";

/** dev client에 react-native-webview 네이티브 모듈이 링크됐는지 */
export function isWebViewNativeModuleAvailable(): boolean {
  return Boolean(
    NativeModules.RNCWebViewModule ?? NativeModules.RNCWebView,
  );
}

export function getKakaoMapLink(latitude: number, longitude: number): string {
  return `https://map.kakao.com/link/map/${latitude},${longitude}`;
}
