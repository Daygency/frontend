import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import {
  getPushCategoryPreferences,
  setPushCategoryPreferences,
  setPushEnabled,
  type PushCategoryPreferences,
} from "../../../lib/apis/notifications/notificationsApi";
import { syncFcmTokenToServer } from "../../../lib/fcmServerSync";
import ShadowCardList, {
  ShadowCardListToggleItem,
} from "../../../components/lists/ShadowCardList";
import {
  getOsPushPermission,
  isFcmMessagingAvailable,
  isPushSupportedNative,
  requestOsPushPermission,
  type PermissionStatus,
} from "../../../lib/pushNotifications";
import { MAIN } from "../../../color";
import styles from "./styles";

type CategoryKey = keyof PushCategoryPreferences;

const CATEGORY_ITEMS: {
  key: CategoryKey;
  label: string;
  description: string;
}[] = [
  {
    key: "announcementMatch",
    label: "맞춤 공고",
    description: "내 전공을 모집하는 새 공고가 올라오면 알림을 받아요.",
  },
  {
    key: "follow",
    label: "팔로우",
    description: "누군가 나를 팔로우하면 알림을 받아요.",
  },
  {
    key: "application",
    label: "지원 알림",
    description: "공고 지원 관련 소식을 알림으로 받아요.",
  },
  {
    key: "review",
    label: "활동 후기",
    description: "상대방이 활동 후기를 남기면 알림을 받아요.",
  },
  {
    key: "inquiry",
    label: "문의 답변",
    description: "고객센터 문의에 답변이 달리면 알림을 받아요.",
  },
  {
    key: "comment",
    label: "댓글",
    description: "내 게시물에 댓글·대댓글이 달리면 알림을 받아요.",
  },
  {
    key: "like",
    label: "좋아요",
    description: "내 게시물에 좋아요를 받으면 알림을 받아요.",
  },
];

const DEFAULT_PREFS: PushCategoryPreferences = {
  follow: true,
  application: true,
  review: true,
  inquiry: true,
  comment: true,
  like: true,
  announcementMatch: true,
};

const NotificationSettingsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  /** null: 확인 전, false: FCM 네이티브 없음(Expo Go 등) */
  const [pushModuleOk, setPushModuleOk] = useState<boolean | null>(null);
  const [osPermission, setOsPermission] =
    useState<PermissionStatus>("undetermined");
  const [prefs, setPrefs] = useState<PushCategoryPreferences>(DEFAULT_PREFS);

  const refreshState = useCallback(async () => {
    if (!isPushSupportedNative()) {
      setPushModuleOk(false);
      setIsLoading(false);
      return;
    }
    const ok = await isFcmMessagingAvailable();
    setPushModuleOk(ok);
    if (!ok) {
      setIsLoading(false);
      return;
    }
    const [perm, serverPrefs] = await Promise.all([
      getOsPushPermission(),
      getPushCategoryPreferences(),
    ]);
    setOsPermission(perm);
    if (serverPrefs) setPrefs(serverPrefs);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refreshState();
  }, [refreshState]);

  const onCategoryChange = async (key: CategoryKey, value: boolean) => {
    if (!isPushSupportedNative()) return;
    if (!(await isFcmMessagingAvailable())) return;

    if (value && osPermission !== "granted") {
      const perm = await requestOsPushPermission();
      setOsPermission(perm);
      if (perm !== "granted") return;
      void setPushEnabled(true);
      void syncFcmTokenToServer();
    }

    setPrefs((prev) => ({ ...prev, [key]: value }));
    void setPushCategoryPreferences({ [key]: value });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ShadowCardList>
        {CATEGORY_ITEMS.map((item, index) => (
          <ShadowCardListToggleItem
            key={item.key}
            label={item.label}
            description={item.description}
            value={osPermission === "granted" && prefs[item.key]}
            onValueChange={(value) => onCategoryChange(item.key, value)}
            disabled={pushModuleOk === false}
            isLast={index === CATEGORY_ITEMS.length - 1}
          />
        ))}
      </ShadowCardList>
    </ScrollView>
  );
};

export default NotificationSettingsScreen;
