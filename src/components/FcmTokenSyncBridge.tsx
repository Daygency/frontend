import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useAuth } from "../contexts/AuthContext";
import { syncFcmTokenToServer } from "../lib/fcmServerSync";

/**
 * 로그인 상태·토큰 갱신 시 서버에 FCM 등록 토큰 동기화.
 */
export function FcmTokenSyncBridge() {
  const { isLoggedIn, isLoading, needsRoleSelection } = useAuth();

  useEffect(() => {
    if (isLoading || !isLoggedIn || needsRoleSelection) return;
    void syncFcmTokenToServer();
  }, [isLoggedIn, isLoading, needsRoleSelection]);

  useEffect(() => {
    if (!isLoggedIn || needsRoleSelection) return;
    const unsub = messaging().onTokenRefresh(() => {
      void syncFcmTokenToServer();
    });
    return unsub;
  }, [isLoggedIn, needsRoleSelection]);

  return null;
}
