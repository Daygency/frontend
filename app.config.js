import fs from "fs";
import path from "path";

const plistPath = path.resolve(__dirname, "GoogleService-Info.plist");
const googleServicesJsonPath = path.resolve(__dirname, "google-services.json");
const googleServicesBase64 = process.env.GOOGLE_SERVICES_PLIST;
const googleServicesJsonBase64 = process.env.GOOGLE_SERVICES_JSON;

if (googleServicesBase64) {
  try {
    fs.writeFileSync(plistPath, googleServicesBase64, { encoding: "base64" });
    console.log("GoogleService-Info.plist generated.");
  } catch (err) {
    console.error("File creation failed:", err);
  }
}

if (googleServicesJsonBase64) {
  try {
    fs.writeFileSync(googleServicesJsonPath, googleServicesJsonBase64, {
      encoding: "base64",
    });
    console.log("google-services.json generated.");
  } catch (err) {
    console.error("google-services.json creation failed:", err);
  }
}

const hasPlist = fs.existsSync(plistPath);
const hasGoogleServicesJson = fs.existsSync(googleServicesJsonPath);

const googleMapsApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";

const googleIosUrlScheme =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME?.trim() ?? "";

const googleSignInPlugins = googleIosUrlScheme
  ? [
      [
        "@react-native-google-signin/google-signin",
        { iosUrlScheme: googleIosUrlScheme },
      ],
    ]
  : [];

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
        NSPhotoLibraryAddUsageDescription:
          "사진을 기기에 저장하기 위해 사진 보관함 접근 권한이 필요합니다.",
        NSPhotoLibraryUsageDescription:
          "사진을 기기에 저장하기 위해 사진 보관함 접근 권한이 필요합니다.",
      },
    },
    android: {
      package: "com.rbdus.mfrontend",
      googleServicesFile: hasGoogleServicesJson
        ? "./google-services.json"
        : undefined,
      config: {
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            forceStaticLinking: ["RNFBApp", "RNFBMessaging"],
            buildReactNativeFromSource: false,
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
      ...googleSignInPlugins,
      [
        "expo-media-library",
        {
          photosPermission:
            "사진을 기기에 저장하기 위해 사진 보관함 접근 권한이 필요합니다.",
          savePhotosPermission:
            "사진을 기기에 저장하기 위해 사진 보관함 접근 권한이 필요합니다.",
        },
      ],
    ],
    extra: {
      eas: { projectId: "773ddc8a-786b-4fa9-8638-2ad456ef803a" },
    },
  },
});
