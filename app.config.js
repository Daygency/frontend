// app.config.js 실행 시 .env 로드 (Expo prebuild/build 시 env 확인)
try {
  require("dotenv").config();
} catch {
  // dotenv 미설치 시 무시
}

module.exports = {
  expo: {
    name: "mfrontend",
    slug: "mfrontend",
    version: "1.0.0",
    plugins: [
      [
        "expo-notifications",
        {
          color: "#1F2A44",
          defaultChannel: "default",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://devrepo.kakao.com/nexus/content/groups/public/",
            ],
          },
        },
      ],
      [
        "@react-native-kakao/core",
        {
          nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? "",
          android: {
            authCodeHandlerActivity: true,
          },
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
    ],
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/daygency-logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      buildNumber: "4",
      bundleIdentifier: "com.rbdus.mfrontend",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.rbdus.mfrontend",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "773ddc8a-786b-4fa9-8638-2ad456ef803a",
      },
    },
  },
};
