import messaging from "@react-native-firebase/messaging";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { unregisterPushDevice } from "../../../lib/apis/notifications/notificationsApi";
import { syncFcmTokenToServer } from "../../../lib/fcmServerSync";
import ShadowCardList, {
  ShadowCardListToggleItem,
} from "../../../components/ShadowCardList/ShadowCardList";
import {
  getEmailOptOut,
  getSmsOptOut,
  setEmailOptOut,
  setSmsOptOut,
} from "../../../lib/notificationPreferences";
import {
  getOsPushPermission,
  getPushReceivePreference,
  isFcmMessagingAvailable,
  isPushSupportedNative,
  requestOsPushPermission,
  setPushReceivePreference,
} from "../../../lib/pushNotifications";
import styles from "./styles";

const NotificationSettingsScreen = () => {
  const [pushOn, setPushOn] = useState(false);
  const [smsOptOut, setSmsOptOutState] = useState(false);
  const [emailOptOut, setEmailOptOutState] = useState(false);
  /** null: 확인 전, false: FCM 네이티브 없음(Expo Go 등) */
  const [pushModuleOk, setPushModuleOk] = useState<boolean | null>(null);

  const refreshPushState = useCallback(async () => {
    if (!isPushSupportedNative()) {
      setPushModuleOk(false);
      setPushOn(false);
      return;
    }
    const ok = await isFcmMessagingAvailable();
    setPushModuleOk(ok);
    if (!ok) {
      setPushOn(false);
      return;
    }
    const [pref, perm] = await Promise.all([
      getPushReceivePreference(),
      getOsPushPermission(),
    ]);
    setPushOn(pref && perm === "granted");
  }, []);

  useEffect(() => {
    (async () => {
      const [sms, email] = await Promise.all([getSmsOptOut(), getEmailOptOut()]);
      setSmsOptOutState(sms);
      setEmailOptOutState(email);
      await refreshPushState();
    })();
  }, [refreshPushState]);

  const onPushChange = async (value: boolean) => {
    if (!isPushSupportedNative()) return;
    if (!(await isFcmMessagingAvailable())) return;
    if (value) {
      await setPushReceivePreference(true);
      const perm = await requestOsPushPermission();
      if (perm !== "granted") {
        await setPushReceivePreference(false);
        setPushOn(false);
        return;
      }
      setPushOn(true);
      void syncFcmTokenToServer();
      return;
    }
    try {
      if (await isFcmMessagingAvailable()) {
        const t = await messaging().getToken();
        if (t) void unregisterPushDevice({ fcmToken: t });
      }
    } catch {
      /* ignore */
    }
    await setPushReceivePreference(false);
    setPushOn(false);
    await refreshPushState();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ShadowCardList>
        <ShadowCardListToggleItem
          label="푸시 알림"
          description="앱을 쓰지 않을 때도 화면 상단(배너) 등으로 뜨는 시스템 알림입니다."
          value={pushOn}
          onValueChange={onPushChange}
          disabled={pushModuleOk === false}
        />
        <ShadowCardListToggleItem
          label="SMS 수신 중단"
          description="문자(SMS)로 보내는 안내를 받지 않습니다."
          value={smsOptOut}
          onValueChange={async (v) => {
            setSmsOptOutState(v);
            await setSmsOptOut(v);
          }}
        />
        <ShadowCardListToggleItem
          label="이메일 알림 중단"
          description="이메일로 보내는 알림을 받지 않습니다."
          value={emailOptOut}
          onValueChange={async (v) => {
            setEmailOptOutState(v);
            await setEmailOptOut(v);
          }}
          isLast
        />
      </ShadowCardList>
    </ScrollView>
  );
};

export default NotificationSettingsScreen;
