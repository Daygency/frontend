import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE = {
  pushReceive: "@daygency/notif_push_receive",
  firstLaunchPrompted: "@daygency/notif_first_launch_prompted_v1",
} as const;

export type PermissionStatus = "granted" | "denied" | "undetermined";

type NotificationsModule = typeof import("expo-notifications");

let notificationsLoadAttempted = false;
let notificationsModule: NotificationsModule | null = null;

/**
 * expo-notifications는 네이티브 모듈(ExpoPushTokenManager 등)이 포함된 빌드에서만 동작합니다.
 * Expo Go / 구버전 클라이언트에서는 로드가 실패할 수 있음 → null 반환.
 */
export async function loadExpoNotifications(): Promise<NotificationsModule | null> {
  if (notificationsLoadAttempted) return notificationsModule;
  notificationsLoadAttempted = true;
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    notificationsModule = null;
    return null;
  }
  try {
    const Notifications = await import("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
      }),
    });
    notificationsModule = Notifications;
    return Notifications;
  } catch {
    notificationsModule = null;
    return null;
  }
}

export function isPushSupportedNative(): boolean {
  return Platform.OS === "ios" || Platform.OS === "android";
}

export async function getOsPushPermission(): Promise<PermissionStatus> {
  const Notifications = await loadExpoNotifications();
  if (!Notifications) return "denied";
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  return "undetermined";
}

/** 사용자가 앱에서 푸시를 받겠다고 한 설정 */
export async function getPushReceivePreference(): Promise<boolean> {
  const v = await AsyncStorage.getItem(STORAGE.pushReceive);
  if (v === null) return true;
  return v === "1";
}

export async function setPushReceivePreference(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE.pushReceive, enabled ? "1" : "0");
}

export async function requestOsPushPermission(): Promise<PermissionStatus> {
  const Notifications = await loadExpoNotifications();
  if (!Notifications) return "denied";
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  return "undetermined";
}

/** 앱 최초 실행 시 1회만 시스템 알림 권한 다이얼로그 시도 (네이티브 모듈 있을 때만) */
export async function promptPushPermissionOnFirstAppOpen(): Promise<void> {
  if (!isPushSupportedNative()) return;
  const Notifications = await loadExpoNotifications();
  if (!Notifications) return;
  const done = await AsyncStorage.getItem(STORAGE.firstLaunchPrompted);
  if (done === "1") return;
  await AsyncStorage.setItem(STORAGE.firstLaunchPrompted, "1");
  const current = await getOsPushPermission();
  if (current === "granted") return;
  await requestOsPushPermission();
}

/** 푸시 네이티브 모듈 사용 가능 여부 (UI 안내용) */
export async function isExpoPushAvailable(): Promise<boolean> {
  return (await loadExpoNotifications()) != null;
}
