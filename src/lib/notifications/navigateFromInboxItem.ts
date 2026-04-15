import { Alert } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../navigations/routes";
import type { InboxRecipientItem } from "../apis/notifications/inboxTypes";

type RootNav = NativeStackNavigationProp<Record<string, object | undefined>>;

const placeholderAnnouncement = {
  title: "",
  type: "",
  status: "모집중" as const,
  daysLeft: 0,
};

/**
 * 인박스 한 건 탭 시 관련 화면으로 이동합니다. (README `targetType` / `likeKind` 기준)
 */
export function navigateFromInboxItem(
  navigation: RootNav,
  item: InboxRecipientItem,
): void {
  const { notice } = item;
  const { targetType, targetId, likeKind, actor } = notice;

  if (targetType === "FOLLOW") {
    if (!actor?.userId) {
      Alert.alert("알림", "이동할 프로필 정보가 없습니다.");
      return;
    }
    navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
      userId: actor.userId,
      activityName: actor.activityName || actor.nickname || "",
    });
    return;
  }

  if (targetType === "APPLICATION") {
    navigation.navigate(RootRoutes.RECEIVED_APPLICATION_DETAIL, {
      applicationId: targetId,
    });
    return;
  }

  if (targetType === "LIKE") {
    switch (likeKind) {
      case "NEWS":
        navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, {
          newsId: targetId,
        });
        return;
      case "COMMUNITY":
        navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
          communityId: targetId,
        });
        return;
      case "ANNOUNCEMENT":
        navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
          postId: targetId,
          ...placeholderAnnouncement,
        });
        return;
      case "COMMENT":
        navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
          communityId: targetId,
        });
        return;
      default:
        Alert.alert("알림", "이 알림에 연결된 화면이 없습니다.");
        return;
    }
  }

  if (targetType === "COMMENT") {
    navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
      communityId: targetId,
    });
    return;
  }

  Alert.alert("알림", "이 알림에 연결된 화면이 없습니다.");
}
