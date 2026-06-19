import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { AUTH_TOKEN_KEY } from "./apis/api";
import { registerPushDevice, type PushDevicePlatform } from "./apis/notifications/notificationsApi";
import { getFcmToken } from "./pushNotifications";

export type SyncFcmResult =
  | { ok: true }
  | { ok: false; reason: "not_logged_in" | "no_fcm_token" | "api"; message?: string };

function platformForApi(): PushDevicePlatform {
  if (Platform.OS === "ios") return "IOS";
  if (Platform.OS === "android") return "ANDROID";
  return "WEB";
}

/**
 * 로그인 후·푸시 ON 후·토큰 갱신 시 서버에 FCM 등록 토큰 전달.
 * @see README.md — POST /notifications/devices
 */
export async function syncFcmTokenToServer(): Promise<SyncFcmResult> {
  const jwt = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!jwt) return { ok: false, reason: "not_logged_in" };

  const fcmToken = await getFcmToken();
  if (!fcmToken) return { ok: false, reason: "no_fcm_token" };

  const res = await registerPushDevice({
    fcmToken,
    platform: platformForApi(),
  });
  if (res.ok) return { ok: true };
  return {
    ok: false,
    reason: "api",
    message: res.message ?? `HTTP ${res.status}`,
  };
}
