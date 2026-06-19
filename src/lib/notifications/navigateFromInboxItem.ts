import { Alert } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../navigations/routes";
import { getCommentById } from "../apis/comment/commentApi";
import type { InboxRecipientItem } from "../apis/notifications/inboxTypes";
import { getMyInquiry, mapInquiryToItem } from "../apis/inquiry/inquiryApi";

type RootNav = NativeStackNavigationProp<Record<string, object | undefined>>;

const placeholderAnnouncement = {
  title: "",
  type: "",
  status: "모집중" as const,
  daysLeft: 0,
};

function showNoScreenAlert(): void {
  Alert.alert("알림", "이 알림에 연결된 화면이 없습니다.");
}

async function navigateToCommentTarget(
  navigation: RootNav,
  commentId: string,
): Promise<boolean> {
  const comment = await getCommentById(commentId);
  if (!comment?.targetId) return false;

  if (comment.targetType === "NEWS") {
    navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, {
      newsId: comment.targetId,
    });
    return true;
  }

  navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
    communityId: comment.targetId,
  });
  return true;
}

/**
 * 인박스 한 건 탭 시 관련 화면으로 이동합니다.
 * `targetId` 의미는 알림 종류마다 다릅니다 (README / 백엔드 notice 생성 로직 기준).
 */
export async function navigateFromInboxItem(
  navigation: RootNav,
  item: InboxRecipientItem,
  options?: { currentUserId?: string },
): Promise<void> {
  const { notice } = item;
  const { targetType, targetId, likeKind, actor, content } = notice;

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
    const text = content?.trim() ?? "";
    if (text.includes("활동 후기")) {
      navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
        postId: targetId,
        ...placeholderAnnouncement,
      });
      return;
    }
    navigation.navigate(RootRoutes.ANNOUNCEMENT_APPLICANTS, {
      postId: targetId,
      title: "",
    });
    return;
  }

  if (targetType === "REVIEW") {
    const userId = options?.currentUserId?.trim();
    if (!userId) {
      showNoScreenAlert();
      return;
    }
    navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
      userId,
      activityName: "",
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
      case "COMMENT": {
        const ok = await navigateToCommentTarget(navigation, targetId);
        if (!ok) showNoScreenAlert();
        return;
      }
      default:
        showNoScreenAlert();
        return;
    }
  }

  if (targetType === "COMMENT") {
    const ok = await navigateToCommentTarget(navigation, targetId);
    if (!ok) showNoScreenAlert();
    return;
  }

  if (targetType === "INQUIRY") {
    const row = await getMyInquiry(targetId);
    if (!row) {
      navigation.navigate(RootRoutes.CUSTOMER_SERVICE);
      return;
    }
    navigation.navigate(RootRoutes.INQUIRY_DETAIL, {
      inquiry: mapInquiryToItem(row),
    });
    return;
  }

  showNoScreenAlert();
}
