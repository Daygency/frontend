import { useEffect } from "react";
import { createNavigationContainerRef } from "@react-navigation/native";
import messaging, {
  type FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { RootRoutes } from "../../navigations/routes";
import { isFcmMessagingAvailable, isPushSupportedNative } from "../pushNotifications";
import { placeholderAnnouncement } from "./navigateFromInboxItem";

/** 푸시 탭처럼 화면 밖에서 이동해야 할 때 쓰는 루트 NavigationContainer ref */
export const rootNavigationRef =
  createNavigationContainerRef<Record<string, object | undefined>>();

type PushData = FirebaseMessagingTypes.RemoteMessage["data"];

/** 앱이 종료 상태에서 푸시로 열렸는데 아직 네비게이션이 준비되지 않은 경우 보관 */
let pendingPushData: PushData | null = null;

function navigateFromPushData(data: PushData): void {
  const targetType = typeof data?.targetType === "string" ? data.targetType : "";
  const targetId = typeof data?.targetId === "string" ? data.targetId : "";
  if (targetType === "ANNOUNCEMENT_MATCH" && targetId) {
    rootNavigationRef.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
      postId: targetId,
      ...placeholderAnnouncement,
    });
  }
}

function handleOpenedPush(message: FirebaseMessagingTypes.RemoteMessage | null) {
  if (!message?.data) return;
  if (rootNavigationRef.isReady()) {
    navigateFromPushData(message.data);
  } else {
    pendingPushData = message.data;
  }
}

/** NavigationContainer `onReady`에서 호출 */
export function flushPendingPushNavigation(): void {
  if (!pendingPushData) return;
  const data = pendingPushData;
  pendingPushData = null;
  navigateFromPushData(data);
}

/** 푸시 알림을 탭해 앱이 열렸을 때(백그라운드/종료 상태 모두) 해당 화면으로 이동 */
export function usePushOpenNavigation(): void {
  useEffect(() => {
    if (!isPushSupportedNative()) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    void (async () => {
      if (!(await isFcmMessagingAvailable()) || cancelled) return;
      unsubscribe = messaging().onNotificationOpenedApp(handleOpenedPush);
      handleOpenedPush(await messaging().getInitialNotification());
    })();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);
}
