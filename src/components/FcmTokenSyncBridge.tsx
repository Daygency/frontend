import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useAuth } from "../contexts/AuthContext";
import { syncFcmTokenToServer } from "../lib/fcmServerSync";

/**
 * 로그인 상태·토큰 갱신 시 서버에 FCM 등록 토큰 동기화.
 */
export function FcmTokenSyncBridge() {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    void syncFcmTokenToServer();
  }, [isLoggedIn, isLoading]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const unsub = messaging().onTokenRefresh(() => {
      void syncFcmTokenToServer();
    });
    return unsub;
  }, [isLoggedIn]);

  return null;
}
