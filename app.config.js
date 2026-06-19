import fs from "fs";
import path from "path";

const plistPath = path.resolve(__dirname, "GoogleService-Info.plist");
const googleServicesBase64 = process.env.GOOGLE_SERVICES_PLIST;

if (googleServicesBase64) {
  try {
    fs.writeFileSync(plistPath, googleServicesBase64, { encoding: "base64" });
    console.log("GoogleService-Info.plist generated.");
  } catch (err) {
    console.error("File creation failed:", err);
  }
}

const hasPlist = fs.existsSync(plistPath);

export default ({ config }) => ({
  ...config,
  expo: {
    name: "mfrontend",
    slug: "mfrontend",
    version: "1.0.0",
    ios: {
      bundleIdentifier: "com.rbdus.mfrontend",
      googleServicesFile: hasPlist ? "./GoogleService-Info.plist" : undefined,
      buildNumber: "4",
      entitlements: { "aps-environment": "production" },
      infoPlist: {
        UIBackgroundModes: ["remote-notification"],
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.rbdus.mfrontend",
      googleServicesFile: fs.existsSync(
        path.resolve(__dirname, "google-services.json"),
      )
        ? "./google-services.json"
        : undefined,
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            forceStaticLinking: ["RNFBApp", "RNFBMessaging"],
          },
          android: {
            extraMavenRepos: ["https://kakao.com"],
          },
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      [
        "@react-native-kakao/core",
        {
          nativeAppKey:
            process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ||
            "dummy_key_for_config",
          android: { authCodeHandlerActivity: true },
          ios: { handleKakaoOpenUrl: true },
        },
      ],
      [
        "@react-native-seoul/naver-login",
        {
          urlScheme:
            process.env.EXPO_PUBLIC_NAVER_URL_SCHEME || "comrbdusmfrontend",
        },
      ],
    ],
    extra: {
      eas: { projectId: "773ddc8a-786b-4fa9-8638-2ad456ef803a" },
    },
  },
});
