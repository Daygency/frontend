import { useEffect } from "react";
import { AppState } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { useAuth } from "../../contexts/AuthContext";
import { syncFcmTokenToServer } from "../../lib/fcmServerSync";
import {
  getOsPushPermission,
  isFcmMessagingAvailable,
  isPushSupportedNative,
  setPushReceivePreference,
} from "../../lib/pushNotifications";

/** OS 알림 권한이 거부된 상태면 로컬 preference도 꺼진 상태로 맞춘다. */
async function syncPreferenceWithOsPermission(): Promise<void> {
  if (!isPushSupportedNative()) return;
  if (!(await isFcmMessagingAvailable())) return;
  const perm = await getOsPushPermission();
  if (perm === "denied") {
    await setPushReceivePreference(false);
  }
}

/**
 * 로그인 상태·포그라운드 복귀·토큰 갱신 시 서버에 FCM 등록 토큰 동기화.
 */
export function FcmTokenSyncBridge() {
  const { isLoggedIn, isLoading, needsRoleSelection } = useAuth();

  useEffect(() => {
    if (isLoading || !isLoggedIn || needsRoleSelection) return;
    void syncPreferenceWithOsPermission().then(() => void syncFcmTokenToServer());
  }, [isLoggedIn, isLoading, needsRoleSelection]);

  useEffect(() => {
    if (!isLoggedIn || needsRoleSelection) return;
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      void syncPreferenceWithOsPermission().then(() => void syncFcmTokenToServer());
    });
    return () => sub.remove();
  }, [isLoggedIn, needsRoleSelection]);

  useEffect(() => {
    if (!isLoggedIn || needsRoleSelection) return;
    const unsub = messaging().onTokenRefresh(() => {
      void syncFcmTokenToServer();
    });
    return unsub;
  }, [isLoggedIn, needsRoleSelection]);

  return null;
}
