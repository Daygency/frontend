import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { Platform, PermissionsAndroid } from "react-native";

const STORAGE = {
  pushReceive: "@daygency/notif_push_receive",
  firstLaunchPrompted: "@daygency/notif_first_launch_prompted_v1",
} as const;

export type PermissionStatus = "granted" | "denied" | "undetermined";

function mapAuthStatus(status: number): PermissionStatus {
  const A = messaging.AuthorizationStatus;
  if (
    status === A.AUTHORIZED ||
    status === A.PROVISIONAL ||
    status === A.EPHEMERAL
  ) {
    return "granted";
  }
  if (status === A.DENIED) return "denied";
  return "undetermined";
}

async function ensureIosRemoteRegistration(): Promise<void> {
  if (Platform.OS !== "ios") return;
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
}

let fcmProbeDone = false;
let fcmNativeOk: boolean | null = null;

/** FCM 네이티브 모듈 사용 가능 여부 (Expo Go 등에서는 false). */
export async function isFcmMessagingAvailable(): Promise<boolean> {
  if (!isPushSupportedNative()) return false;
  if (fcmProbeDone) return fcmNativeOk === true;
  fcmProbeDone = true;
  try {
    await messaging().hasPermission();
    fcmNativeOk = true;
  } catch {
    fcmNativeOk = false;
  }
  return fcmNativeOk === true;
}

export function isPushSupportedNative(): boolean {
  return Platform.OS === "ios" || Platform.OS === "android";
}

export async function getOsPushPermission(): Promise<PermissionStatus> {
  if (!(await isFcmMessagingAvailable())) return "denied";
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const ok = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return ok ? "granted" : "undetermined";
  }
  const status = await messaging().hasPermission();
  return mapAuthStatus(status);
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
  if (!(await isFcmMessagingAvailable())) return "denied";
  await ensureIosRemoteRegistration();
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (result === PermissionsAndroid.RESULTS.GRANTED) return "granted";
    return "denied";
  }
  const status = await messaging().requestPermission();
  return mapAuthStatus(status);
}

/** 권한이 있을 때 FCM 등록 토큰 (백엔드 전달용). */
export async function getFcmToken(): Promise<string | null> {
  if (!(await isFcmMessagingAvailable())) return null;
  const perm = await getOsPushPermission();
  if (perm !== "granted") return null;
  try {
    await ensureIosRemoteRegistration();
    return await messaging().getToken();
  } catch {
    return null;
  }
}

/** 앱 최초 실행 시 1회만 시스템 알림 권한 다이얼로그 시도 */
export async function promptPushPermissionOnFirstAppOpen(): Promise<void> {
  if (!isPushSupportedNative()) return;
  if (!(await isFcmMessagingAvailable())) return;
  const done = await AsyncStorage.getItem(STORAGE.firstLaunchPrompted);
  if (done === "1") return;
  await AsyncStorage.setItem(STORAGE.firstLaunchPrompted, "1");
  const current = await getOsPushPermission();
  if (current === "granted") return;
  await requestOsPushPermission();
}

/** @deprecated 이름 호환 — FCM 사용 */
export async function isExpoPushAvailable(): Promise<boolean> {
  return isFcmMessagingAvailable();
}
