/**
 * @react-native-seoul/naver-login — `initialize({ serviceUrlSchemeIOS })` 및
 * 네이버 개발자센터 > 모바일(앱) > iOS URL Scheme 과 동일해야 합니다.
 */
export const NAVER_URL_SCHEME =
  process.env.EXPO_PUBLIC_NAVER_URL_SCHEME?.trim() || "comrbdusmfrontend";

export const NAVER_APP_NAME = "DAYGENCY";
