import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ReviewCard from "../../cards/ReviewCard";
import ReviewOptionsMenu from "../../menus/ReviewOptionsMenu";
import ReportCategoryModal from "../../modals/ReportCategoryModal";
import EmptyState, {
  contentContainerWhenEmpty,
  emptyScreenStyle,
  emptySectionStyle,
} from "../../ui/EmptyState";
import { GRAY } from "../../../color";
import {
  getReceivedActivityReviewList,
  getUserReceivedActivityReviewList,
  hasHiddenReceivedActivityReviews,
  hideActivityReviewFromProfile,
  unhideActivityReviewFromProfile,
} from "../../../lib/apis/announcement/activityReviewApi";
import type { ActivityReviewListItem } from "../../../lib/apis/announcement/activityReviewTypes";
import { createReport } from "../../../lib/apis/report/reportApi";
import type { ReportCategory } from "../../../lib/apis/report/types";
import { useAuth } from "../../../contexts/AuthContext";
import { confirmReportSubmission } from "../../../lib/report/confirmReportSubmission";
import { messageForReportHttpStatus } from "../../../lib/report/reportErrorMessage";
import { RootRoutes } from "../../../navigations/routes";

export const RECEIVED_REVIEW_PREVIEW_LIMIT = 3;

type Props = {
  /** 타인 포트폴리오 userId — 없으면 내 받은 후기 */
  userId?: string;
  /** 프로필에서 숨긴 후기만 표시 (본인 전용) */
  hiddenOnly?: boolean;
  /** 지정 시 해당 개수만 표시 (미리보기) */
  previewLimit?: number;
  onShowMoreChange?: (show: boolean) => void;
  onHasHiddenReviewsChange?: (hasHidden: boolean) => void;
  cardWrapperStyle?: StyleProp<ViewStyle>;
  listContentStyle?: StyleProp<ViewStyle>;
};

function formatDate(iso?: string | null): string {
  if (!iso?.trim()) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function reactionLabel(rating: ActivityReviewListItem["rating"]) {
  if (rating === "DISAPPOINTING") return "아쉬웠어요";
  if (rating === "GOOD") return "좋았어요";
  return "감동했어요";
}

function reviewerRoleLabel(role: ActivityReviewListItem["reviewerRole"]) {
  return role === "owner" ? "기획자" : "연주자";
}

const ReceivedReviewsList = ({
  userId,
  hiddenOnly = false,
  previewLimit,
  onShowMoreChange,
  onHasHiddenReviewsChange,
  cardWrapperStyle,
  listContentStyle,
}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user, isLoggedIn } = useAuth();
  const isOwnProfile = !userId?.trim();

  const [items, setItems] = useState<ActivityReviewListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reportTarget, setReportTarget] = useState<ActivityReviewListItem | null>(
    null,
  );
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [hideLoadingId, setHideLoadingId] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (cursor?: string | null) => {
      const trimmedUserId = userId?.trim();
      const limit = previewLimit != null ? previewLimit + 1 : 8;
      if (trimmedUserId) {
        return getUserReceivedActivityReviewList(trimmedUserId, {
          cursor: cursor ?? undefined,
          limit,
        });
      }
      return getReceivedActivityReviewList({
        cursor: cursor ?? undefined,
        limit,
        hiddenOnly: hiddenOnly || undefined,
      });
    },
    [userId, previewLimit, hiddenOnly],
  );

  const loadFirst = useCallback(async () => {
    setLoading(true);
    const res = await fetchPage();
    if (!res) {
      setItems([]);
      setNextCursor(null);
      setHasMore(false);
      onShowMoreChange?.(false);
      setLoading(false);
      return;
    }
    setItems(res.items);
    setNextCursor(res.nextCursor);
    setHasMore(res.hasMore);
    if (previewLimit != null) {
      onShowMoreChange?.(res.items.length > previewLimit || res.hasMore);
    }
    if (hiddenOnly) {
      onHasHiddenReviewsChange?.(res.items.length > 0 || res.hasMore);
    }
    setLoading(false);
  }, [fetchPage, previewLimit, onShowMoreChange, hiddenOnly, onHasHiddenReviewsChange]);

  useEffect(() => {
    void loadFirst();
  }, [loadFirst]);

  useFocusEffect(
    useCallback(() => {
      void loadFirst();
      return () => {};
    }, [loadFirst]),
  );

  const loadMore = useCallback(async () => {
    if (previewLimit != null || !hasMore || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    const res = await fetchPage(nextCursor);
    if (res) {
      setItems((prev) => [...prev, ...res.items]);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  }, [previewLimit, hasMore, loadingMore, nextCursor, fetchPage]);

  const navigateToAnnouncement = useCallback(
    (item: ActivityReviewListItem) => {
      if (!item.postId?.trim()) return;
      navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
        postId: item.postId,
        title: item.announcement?.title ?? "",
        type: "",
        status: "모집중",
        daysLeft: 0,
      });
    },
    [navigation],
  );

  const handleHide = useCallback(
    async (item: ActivityReviewListItem) => {
      if (!isOwnProfile) return;
      setHideLoadingId(item.id);
      const res = await hideActivityReviewFromProfile(item.id);
      setHideLoadingId(null);
      if (!res.ok) {
        Alert.alert("알림", res.message || "숨김 처리에 실패했습니다.");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      onHasHiddenReviewsChange?.(true);
    },
    [isOwnProfile, onHasHiddenReviewsChange],
  );

  const handleUnhide = useCallback(
    async (item: ActivityReviewListItem) => {
      if (!isOwnProfile || !hiddenOnly) return;
      setHideLoadingId(item.id);
      const res = await unhideActivityReviewFromProfile(item.id);
      setHideLoadingId(null);
      if (!res.ok) {
        Alert.alert("알림", res.message || "다시 표시에 실패했습니다.");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      const stillHasHidden = await hasHiddenReceivedActivityReviews();
      onHasHiddenReviewsChange?.(stillHasHidden);
    },
    [isOwnProfile, hiddenOnly, onHasHiddenReviewsChange],
  );

  const openReport = useCallback(
    (item: ActivityReviewListItem) => {
      if (!isLoggedIn) {
        Alert.alert("알림", "로그인이 필요합니다.");
        return;
      }
      const reviewerId = item.reviewer?.userId?.trim();
      const myId = user?.socialId?.trim();
      if (!reviewerId) {
        Alert.alert("알림", "신고할 수 없습니다. 작성자 정보를 불러오지 못했습니다.");
        return;
      }
      if (myId && reviewerId === myId) {
        Alert.alert("알림", "본인을 신고할 수 없습니다.");
        return;
      }
      setReportTarget(item);
    },
    [isLoggedIn, user?.socialId],
  );

  const handlePickReportCategory = useCallback(
    (category: ReportCategory) => {
      const item = reportTarget;
      const reportedUserId = item?.reviewer?.userId?.trim();
      if (!item || !reportedUserId) return;
      confirmReportSubmission(async () => {
        setReportSubmitting(true);
        try {
          const res = await createReport({
            reportedUserId,
            category,
            targetType: "REVIEW",
            targetId: item.id,
          });
          if (res.ok) {
            setReportTarget(null);
            Alert.alert("접수 완료", "신고가 접수되었습니다.");
          } else {
            Alert.alert(
              "알림",
              messageForReportHttpStatus(res.status, res.message),
            );
          }
        } finally {
          setReportSubmitting(false);
        }
      });
    },
    [reportTarget],
  );

  const displayItems =
    previewLimit != null ? items.slice(0, previewLimit) : items;

  const emptyMessage = hiddenOnly
    ? "숨겨진 후기가 없습니다."
    : "받은 후기가 없습니다.";

  const renderItem = (item: ActivityReviewListItem) => (
    <View style={cardWrapperStyle}>
      <ReviewCard
        author={`${reviewerRoleLabel(item.reviewerRole)} · ${
          item.reviewer?.activityName || item.reviewer?.name || "작성자"
        }`}
        date={formatDate(item.createdAt)}
        title={item.announcement?.title || item.postId}
        content={item.comment ?? undefined}
        reactionTag={reactionLabel(item.rating)}
        profileImgUrl={item.reviewer?.profileImgUrl}
        onPress={() => navigateToAnnouncement(item)}
        optionsMenu={
          isOwnProfile ? (
            <ReviewOptionsMenu
              isOwnProfile={isOwnProfile}
              isHidden={hiddenOnly}
              loading={hideLoadingId === item.id}
              onHide={
                !hiddenOnly ? () => void handleHide(item) : undefined
              }
              onUnhide={
                hiddenOnly ? () => void handleUnhide(item) : undefined
              }
              onReport={() => openReport(item)}
            />
          ) : undefined
        }
      />
    </View>
  );

  if (loading) {
    return (
      <View style={{ paddingVertical: 24, alignItems: "center" }}>
        <ActivityIndicator size="small" color={GRAY.DARK} />
      </View>
    );
  }

  if (displayItems.length === 0) {
    const emptyBody = (
      <>
        <EmptyState message={emptyMessage} />
        <ReportCategoryModal
          visible={reportTarget != null}
          onClose={() => !reportSubmitting && setReportTarget(null)}
          onSelect={handlePickReportCategory}
          submitting={reportSubmitting}
        />
      </>
    );

    return (
      <View
        style={previewLimit != null ? emptySectionStyle : emptyScreenStyle}
      >
        {emptyBody}
      </View>
    );
  }

  if (previewLimit != null) {
    return (
      <>
        {displayItems.map((item) => (
          <View key={item.id}>{renderItem(item)}</View>
        ))}
        <ReportCategoryModal
          visible={reportTarget != null}
          onClose={() => !reportSubmitting && setReportTarget(null)}
          onSelect={handlePickReportCategory}
          submitting={reportSubmitting}
        />
      </>
    );
  }

  return (
    <>
      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
        onEndReached={() => void loadMore()}
        onEndReachedThreshold={0.4}
        contentContainerStyle={contentContainerWhenEmpty(
          displayItems.length === 0,
          listContentStyle,
        )}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator size="small" color={GRAY.DARK} />
            </View>
          ) : null
        }
      />
      <ReportCategoryModal
        visible={reportTarget != null}
        onClose={() => !reportSubmitting && setReportTarget(null)}
        onSelect={handlePickReportCategory}
        submitting={reportSubmitting}
      />
    </>
  );
};

export default ReceivedReviewsList;
