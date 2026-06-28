import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  Alert,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  commentInputBarPaddingBottom,
  useKeyboardHeight,
} from "../../hooks/useKeyboardHeight";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import navigationHeaderStyles from "../../navigations/styles";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../color";
import { Ionicons } from "@expo/vector-icons";
import CommentInputBar from "../../components/comments/CommentInputBar";
import CommentAuthorAvatar from "../../components/comments/CommentAuthorAvatar";
import { getNewsDetail, deleteNews } from "../../lib/apis/news/newsApi";
import type { NewsDetailResponse } from "../../lib/apis/news/types";
import styles from "./styles";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../../lib/apis/comment/commentApi";
import type { CommentItem as ApiCommentItem } from "../../lib/apis/comment/types";
import { pickCommentUserProfileImgUrl } from "../../lib/apis/comment/commentUserProfile";
import PostDetailOptionsMenu from "../../components/menus/PostDetailOptionsMenu";
import { RootRoutes } from "../../navigations/routes";
import { promptOwnCommentActions } from "../../lib/comment/promptOwnCommentActions";
import {
  createLike,
  deleteLikeByTarget,
  getLikes,
} from "../../lib/apis/like/likeApi";
import {
  createScrap,
  deleteScrapByTarget,
  getScraps,
} from "../../lib/apis/scrap/scrapApi";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import ReportCategoryModal from "../../components/modals/ReportCategoryModal";
import ReportDotsDropdownMenu from "../../components/menus/ReportDotsDropdownMenu";
import { createReport } from "../../lib/apis/report/reportApi";
import type { ReportCategory, ReportTargetType } from "../../lib/apis/report/types";
import { messageForReportHttpStatus } from "../../lib/report/reportErrorMessage";
import { confirmReportSubmission } from "../../lib/report/confirmReportSubmission";
import { pickReportedUserIdFromUnknown } from "../../lib/report/pickReportedUserId";
import {
  mapAttachmentsToImageUrls,
  pickUrlFromFileLike,
} from "../../lib/media/attachmentImageUrl";
import KakaoMapView from "../../components/kakao/KakaoMapView/KakaoMapView";
import ImageCarousel from "../../components/media/ImageCarousel";
import { parseCoord } from "../../lib/kakao/location";
import { formatPerformanceDetailDateLabel } from "../../lib/news/formatPerformanceOpenLabel";
import { formatNewsTicketPrice } from "../../lib/news/buildPerformanceNewsDisplay";
import { pickUserNickname } from "../../lib/user/pickUserNickname";
import { getMyProfile } from "../../lib/apis/portfolio/profileApi";
import { getProfileCache } from "../../lib/profileCache";

export type MusicNewsDetailItem = {
  id: string;
  title: string;
  place: string;
  latitude?: number | null;
  longitude?: number | null;
  date: string;
  time: string;
  contact: string;
  ticketPrice?: number | null;
  authorName?: string;
  uploadedAt: string;
  description: string;
  /** @deprecated 첫 이미지 — `imageUrls[0]`과 동일 */
  imageUrl?: string;
  /** README `attachments` / `file` 에서 수집한 이미지 URL */
  imageUrls?: string[];
  likes: number;
  comments: number;
  commentsData?: unknown[];
  attachments?: { name: string; size: string }[];
};

type MusicNewsDetailRouteParams = {
  newsId?: string;
  news?: MusicNewsDetailItem;
};

type MusicNewsDetailRouteProp = RouteProp<
  { MusicNewsDetail: MusicNewsDetailRouteParams },
  "MusicNewsDetail"
>;

type CommentItem = {
  id: string;
  author: string;
  profileImgUrl?: string;
  createdAt: string;
  content: string;
  likeCount: number;
  replyCount: number;
  isLiked?: boolean;
  isMine?: boolean;
  authorUserId?: string;
  replies?: Array<{
    id: string;
    author: string;
    profileImgUrl?: string;
    createdAt?: string;
    content: string;
    likeCount?: number;
    isLiked?: boolean;
    isMine?: boolean;
    authorUserId?: string;
  }>;
};

function mapApiToItem(res: NewsDetailResponse): MusicNewsDetailItem {
  const d = new Date(res.startedAt);
  const dateStr = formatPerformanceDetailDateLabel(res.startedAt, res.endedAt);
  const timeStr = isNaN(d.getTime())
    ? ""
    : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const createdD = new Date(res.createdAt);
  const uploadedStr = isNaN(createdD.getTime())
    ? res.createdAt
    : `${createdD.getFullYear()}.${String(createdD.getMonth() + 1).padStart(2, "0")}.${String(createdD.getDate()).padStart(2, "0")}`;

  const fromAttachments = mapAttachmentsToImageUrls(res.attachments);
  const fromFile = pickUrlFromFileLike(
    res.file ? (res.file as Record<string, unknown>) : null,
  );
  const imageUrls =
    fromAttachments.length > 0
      ? fromAttachments
      : fromFile
        ? [fromFile]
        : [];

  return {
    id: res.newsId,
    title: res.title,
    place: res.place,
    latitude: parseCoord(res.latitude),
    longitude: parseCoord(res.longitude),
    date: dateStr,
    time: timeStr || "00:00",
    contact: res.contact ?? "",
    ticketPrice: res.ticketPrice,
    authorName: pickUserNickname(
      res.user && typeof res.user === "object"
        ? (res.user as Record<string, unknown>)
        : null,
    ),
    uploadedAt: uploadedStr,
    description: res.content,
    imageUrl: imageUrls[0],
    imageUrls,
    likes: 0,
    comments: 0,
    commentsData: (res as any)?.comments,
  };
}

function formatTimeAgo(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours}시간`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}일`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}개월`;
  return `${Math.floor(diffMonths / 12)}년`;
}

function mapCommentToUi(comment: ApiCommentItem, myUserId?: string): CommentItem {
  const uid = String(comment.user?.userId ?? "").trim();
  const isMine = Boolean(myUserId && uid && uid === myUserId);
  const profileImgUrl = pickCommentUserProfileImgUrl(comment.user);
  return {
    id: String(comment.id),
    author: String(comment.user?.name ?? "익명"),
    ...(profileImgUrl ? { profileImgUrl } : {}),
    createdAt: String(comment.createdAt ?? ""),
    content: String(comment.content ?? ""),
    likeCount: Number((comment as any)?.likeCount ?? 0),
    replyCount: 0,
    isLiked: Boolean((comment as any)?.isLiked),
    isMine,
    ...(uid ? { authorUserId: uid } : {}),
    replies: [],
  };
}

function buildCommentTree(raw: ApiCommentItem[], myUserId?: string): CommentItem[] {
  const roots: CommentItem[] = [];
  const childrenByParent = new Map<string, CommentItem[]>();

  raw.forEach((comment) => {
    const ui = mapCommentToUi(comment, myUserId);
    const parentId = comment.parentId ? String(comment.parentId) : null;
    if (!parentId) {
      roots.push(ui);
      return;
    }
    const siblings = childrenByParent.get(parentId) ?? [];
    siblings.push(ui);
    childrenByParent.set(parentId, siblings);
  });

  roots.forEach((root) => {
    const replies = childrenByParent.get(root.id) ?? [];
    root.replies = replies;
    root.replyCount = replies.length;
  });

  return roots;
}

function updateCommentLikeState(
  list: CommentItem[],
  targetId: string,
  nextLiked: boolean,
): CommentItem[] {
  return list.map((comment) => {
    if (comment.id === targetId) {
      const prevCount = Number(comment.likeCount ?? 0);
      return {
        ...comment,
        isLiked: nextLiked,
        likeCount: nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1),
      };
    }

    const replies = comment.replies?.map((reply) => {
      if (reply.id !== targetId) return reply;
      const prevCount = Number(reply.likeCount ?? 0);
      return {
        ...reply,
        isLiked: nextLiked,
        likeCount: nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1),
      };
    });

    return replies ? { ...comment, replies } : comment;
  });
}

const MusicNewsDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<MusicNewsDetailRouteProp>();
  const { user, isLoggedIn } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const { bottom } = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const newsId = route.params?.newsId;
  const newsFromParams = route.params?.news;

  const [news, setNews] = useState<MusicNewsDetailItem | null>(
    newsFromParams ?? null,
  );
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [replyTarget, setReplyTarget] = useState<{ id: string; author: string } | null>(null);
  const [editingComment, setEditingComment] = useState<{
    commentId: string;
    initialContent: string;
  } | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [scraped, setScraped] = useState(false);
  const [scrapCount, setScrapCount] = useState(0);
  const [loading, setLoading] = useState(!!newsId);
  const [error, setError] = useState<string | null>(null);
  const [newsAuthorUserId, setNewsAuthorUserId] = useState<string | null>(null);
  /** API `isMine` — 작성자 id가 비어 있어도 본인 글 판별 */
  const [isMineFromApi, setIsMineFromApi] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportPending, setReportPending] = useState<{
    reportedUserId: string;
    targetType: ReportTargetType;
    targetId: string;
  } | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!newsId) return;
    setLoading(true);
    setError(null);
    const res = await getNewsDetail(newsId);
    setLoading(false);
    if (res) {
      let mapped = mapApiToItem(res);
      const authorUserId = pickReportedUserIdFromUnknown(res.user) ?? null;
      const mine =
        Boolean(res.isMine) ||
        Boolean(
          authorUserId &&
            user?.socialId?.trim() &&
            authorUserId === user.socialId.trim(),
        );
      if (mine && user?.socialId?.trim()) {
        const myProfile =
          (await getMyProfile().catch(() => null)) ??
          (await getProfileCache());
        const userRaw =
          res.user && typeof res.user === "object"
            ? (res.user as Record<string, unknown>)
            : null;
        mapped = {
          ...mapped,
          authorName: pickUserNickname({
            activityName:
              (typeof userRaw?.activityName === "string"
                ? userRaw.activityName
                : undefined) ?? myProfile?.activityName,
            name:
              (typeof userRaw?.name === "string" ? userRaw.name : undefined) ??
              myProfile?.name ??
              user.name,
          }),
        };
      }
      setNews(mapped);
      setNewsAuthorUserId(authorUserId);
      setIsMineFromApi(Boolean(res.isMine));
    } else {
      setError("공연소식을 불러오지 못했습니다.");
      setNewsAuthorUserId(null);
      setIsMineFromApi(false);
    }
  }, [newsId, user?.socialId, user?.name]);

  useEffect(() => {
    if (newsId) {
      fetchDetail();
    }
  }, [newsId, fetchDetail]);

  const displayedComments = comments;
  const targetNewsId = newsId ?? news?.id;
  const myUserId = user?.socialId?.trim() ?? "";
  const commentCount = Number(
    (news as any)?.commentCount ?? news?.comments ?? comments.length,
  );

  useEffect(() => {
    if (!targetNewsId) return;
    (async () => {
      const res = await getComments({
        targetType: "NEWS",
        targetId: targetNewsId,
      });
      if (res) setComments(buildCommentTree(res, myUserId));
    })();
  }, [targetNewsId, myUserId]);

  const refreshComments = useCallback(async () => {
    if (!targetNewsId) return;
    const res = await getComments({
      targetType: "NEWS",
      targetId: targetNewsId,
    });
    if (res) setComments(buildCommentTree(res, myUserId));
  }, [targetNewsId, myUserId]);

  useEffect(() => {
    if (!targetNewsId) return;
    (async () => {
      const res = await getLikes({
        likeType: "NEWS",
        targetId: targetNewsId,
      });
      if (!res) return;
      setLikeCount(res.count);
      const myId = user?.socialId;
      setLiked(
        !!myId &&
          res.items.some((item) => String(item.user?.userId ?? "") === myId),
      );
    })();
  }, [targetNewsId, user?.socialId]);

  useEffect(() => {
    if (!targetNewsId) return;
    (async () => {
      const res = await getScraps({
        targetType: "NEWS",
        targetId: targetNewsId,
      });
      if (!res) return;
      setScrapCount(res.count);
      const myId = user?.socialId;
      setScraped(
        !!myId &&
          res.items.some((item) => String(item.user?.userId ?? "") === myId),
      );
    })();
  }, [targetNewsId, user?.socialId]);

  const isNewsMine =
    isMineFromApi ||
    (Boolean(newsAuthorUserId && user?.socialId) &&
      newsAuthorUserId === user?.socialId?.trim());

  const openReportPost = useCallback(() => {
    if (!ensureLoggedIn()) return;
    if (isNewsMine) {
      Alert.alert("알림", "본인이 작성한 글은 신고할 수 없습니다.");
      return;
    }
    if (!newsAuthorUserId || !targetNewsId) {
      Alert.alert("알림", "작성자 정보를 불러오지 못했습니다.");
      return;
    }
    if (newsAuthorUserId === user?.socialId?.trim()) {
      Alert.alert("알림", "본인을 신고할 수 없습니다.");
      return;
    }
    setReportPending({
      reportedUserId: newsAuthorUserId,
      targetType: "NEWS",
      targetId: targetNewsId,
    });
    setReportModalVisible(true);
  }, [
    isLoggedIn,
    isNewsMine,
    newsAuthorUserId,
    targetNewsId,
    user?.socialId,
  ]);

  const openReportComment = useCallback(
    (targetId: string, reportedUserId: string | undefined) => {
      if (!ensureLoggedIn()) return;
      if (!reportedUserId) {
        Alert.alert("알림", "신고할 수 없습니다.");
        return;
      }
      if (reportedUserId === user?.socialId?.trim()) {
        Alert.alert("알림", "본인을 신고할 수 없습니다.");
        return;
      }
      setReportPending({
        reportedUserId,
        targetType: "COMMENT",
        targetId,
      });
      setReportModalVisible(true);
    },
    [isLoggedIn, user?.socialId],
  );

  const canOpenPostReportMenu =
    !loading &&
    Boolean(news) &&
    !isNewsMine &&
    Boolean(targetNewsId);

  const onEditNews = useCallback(() => {
    if (!targetNewsId) return;
    navigation.navigate(RootRoutes.MUSIC_NEWS_REGISTRATION, {
      newsId: targetNewsId,
    });
  }, [navigation, targetNewsId]);

  const onDeleteNews = useCallback(() => {
    if (!targetNewsId) return;
    Alert.alert("삭제", "이 공연소식을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const res = await deleteNews(targetNewsId);
          if (res.ok) {
            navigation.goBack();
          } else {
            Alert.alert("알림", "삭제에 실패했습니다.");
          }
        },
      },
    ]);
  }, [navigation, targetNewsId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={navigationHeaderStyles.rightItemsWrap}>
          {isNewsMine ? (
            <PostDetailOptionsMenu
              isMine
              loading={loading}
              onEdit={onEditNews}
              onDelete={onDeleteNews}
            />
          ) : (
            <ReportDotsDropdownMenu
              enabled={canOpenPostReportMenu}
              loading={loading}
              onReport={openReportPost}
              variant="header"
            />
          )}
        </View>
      ),
    });
  }, [
    navigation,
    loading,
    canOpenPostReportMenu,
    openReportPost,
    isNewsMine,
    onEditNews,
    onDeleteNews,
  ]);

  const handlePickReportCategory = useCallback(
    (category: ReportCategory) => {
      if (!reportPending) return;
      const payload = reportPending;
      confirmReportSubmission(async () => {
        setReportSubmitting(true);
        try {
          const res = await createReport({ ...payload, category });
          if (res.ok) {
            setReportModalVisible(false);
            setReportPending(null);
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
    [reportPending],
  );

  const handleToggleLike = async () => {
    if (!ensureLoggedIn()) return;
    if (!targetNewsId) return;
    if (liked) {
      const res = await deleteLikeByTarget({
        likeType: "NEWS",
        targetId: targetNewsId,
      });
      if (!res.success) {
        Alert.alert("알림", "좋아요 취소에 실패했습니다.");
        return;
      }
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
      return;
    }
    const created = await createLike({
      likeType: "NEWS",
      targetId: targetNewsId,
    });
    if (!created) {
      Alert.alert("알림", "좋아요에 실패했습니다.");
      return;
    }
    setLiked(true);
    setLikeCount((prev) => prev + 1);
  };

  const handleToggleScrap = async () => {
    if (!ensureLoggedIn()) return;
    if (!targetNewsId) return;
    if (scraped) {
      const res = await deleteScrapByTarget({
        targetType: "NEWS",
        targetId: targetNewsId,
      });
      if (!res.success) {
        Alert.alert("알림", "스크랩 취소에 실패했습니다.");
        return;
      }
      setScraped(false);
      setScrapCount((prev) => Math.max(0, prev - 1));
      return;
    }
    const created = await createScrap({
      targetType: "NEWS",
      targetId: targetNewsId,
    });
    if (!created) {
      Alert.alert("알림", "스크랩에 실패했습니다.");
      return;
    }
    setScraped(true);
    setScrapCount((prev) => prev + 1);
  };

  const handleCreateComment = async (content: string) => {
    if (!ensureLoggedIn()) return;
    if (!targetNewsId) return;
    if (editingComment) {
      const updated = await updateComment(editingComment.commentId, { content });
      if (!updated) {
        Alert.alert("알림", "댓글 수정에 실패했습니다.");
        return;
      }
      setEditingComment(null);
      await refreshComments();
      return;
    }
    const created = await createComment({
      content,
      targetType: "NEWS",
      targetId: targetNewsId,
      parentId: replyTarget?.id,
    });
    if (!created) {
      Alert.alert("알림", "댓글 작성에 실패했습니다.");
      return;
    }
    await refreshComments();
    setReplyTarget(null);
  };

  const handleDeleteComment = useCallback(
    (commentId: string) => {
      Alert.alert("삭제", "댓글을 삭제할까요?", [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            const res = await deleteComment(commentId);
            if (!res.ok) {
              Alert.alert("알림", "댓글 삭제에 실패했습니다.");
              return;
            }
            if (editingComment?.commentId === commentId) {
              setEditingComment(null);
            }
            await refreshComments();
          },
        },
      ]);
    },
    [editingComment, refreshComments],
  );

  const openOwnCommentActions = useCallback(
    (comment: Pick<CommentItem, "id" | "content">) => {
      promptOwnCommentActions({
        onEdit: () => {
          setReplyTarget(null);
          setEditingComment({
            commentId: comment.id,
            initialContent: comment.content,
          });
        },
        onDelete: () => handleDeleteComment(comment.id),
      });
    },
    [handleDeleteComment],
  );

  const handleToggleCommentLike = async (targetId: string, currentLiked: boolean) => {
    if (!ensureLoggedIn()) return;
    if (currentLiked) {
      const res = await deleteLikeByTarget({
        likeType: "COMMENT",
        targetId,
      });
      if (!res.success) {
        Alert.alert("알림", "댓글 좋아요 취소에 실패했습니다.");
        return;
      }
      setComments((prev) => updateCommentLikeState(prev, targetId, false));
      return;
    }

    const created = await createLike({
      likeType: "COMMENT",
      targetId,
    });
    if (!created) {
      Alert.alert("알림", "댓글 좋아요에 실패했습니다.");
      return;
    }
    setComments((prev) => updateCommentLikeState(prev, targetId, true));
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", flex: 1 },
        ]}
      >
        <ActivityIndicator size="large" color={GRAY.DARK} />
        <Text style={{ marginTop: 12, fontSize: 14, color: GRAY.DARK_2 }}>
          공연소식을 불러오는 중...
        </Text>
      </View>
    );
  }

  if (error || !news) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", flex: 1 },
        ]}
      >
        <Text style={{ fontSize: 14, color: GRAY.DARK_2, textAlign: "center" }}>
          {error ?? "정보를 불러올 수 없습니다."}
        </Text>
        {newsId && (
          <Pressable onPress={fetchDetail} style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 14, color: "#0057D9" }}>다시 시도</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const ticketPriceLabel = formatNewsTicketPrice(news.ticketPrice);

  return (
    <View style={styles.container}>
      <View style={styles.detailInner}>
        <ScrollView
          style={styles.detailScroll}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {news.imageUrls && news.imageUrls.length > 0 ? (
            <View style={styles.carouselWrapper}>
              <ImageCarousel
                gap={0}
                images={news.imageUrls}
                fitImageHeight
              />
            </View>
          ) : null}

          <View style={styles.contentSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{news.title}</Text>
              <Text style={styles.uploadedAt}>{news.uploadedAt}</Text>
            </View>

            {news.authorName ? (
              <>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>작성자</Text>
                  <Text style={styles.infoValue}>{news.authorName}</Text>
                </View>
                <View style={styles.divider} />
              </>
            ) : null}

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>예정일</Text>
              <Text style={styles.infoValue}>{news.date}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>예정 시간</Text>
              <Text style={styles.infoValue}>{news.time}</Text>
            </View>

            {ticketPriceLabel ? (
              <>
                <View style={styles.divider} />
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>티켓 가격</Text>
                  <Text style={styles.infoValue}>{ticketPriceLabel}</Text>
                </View>
              </>
            ) : null}

            <View style={styles.divider} />

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>장소</Text>
              <Text style={styles.infoValue}>{news.place}</Text>
            </View>

            {news.place?.trim() ? (
              <>
                <View style={styles.divider} />
                <View style={styles.mapSection}>
                  <KakaoMapView
                    latitude={news.latitude}
                    longitude={news.longitude}
                    place={news.place}
                    height={200}
                  />
                </View>
              </>
            ) : null}

            {news.contact?.trim() ? (
              <>
                <View style={styles.divider} />

                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>문의</Text>
                  <Text style={styles.infoValue}>{news.contact}</Text>
                </View>
              </>
            ) : null}

            <View style={styles.divider} />

            <Text style={styles.description}>{news.description}</Text>

            {news.attachments && news.attachments.length > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.attachmentsCard}>
                  <Text style={styles.attachmentsTitle}>첨부파일</Text>
                  {news.attachments.map((file, index) => (
                    <Pressable key={index} style={styles.fileRow}>
                      <MaterialCommunityIcons
                        name="paperclip"
                        size={18}
                        color={GRAY.DARK}
                      />
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileSize}>{file.size}</Text>
                      <MaterialCommunityIcons
                        name="download"
                        size={20}
                        color={GRAY.DARK}
                      />
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.actionRow}>
              <View style={styles.actionItem}>
                <Pressable onPress={handleToggleLike} hitSlop={8}>
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={21}
                    color={RED.DEFAULT}
                  />
                </Pressable>
                <Text style={styles.actionCount}>{likeCount}</Text>
              </View>
              <View style={styles.actionItem}>
                <Ionicons name="chatbubble-outline" size={19} color={BLACK} />
                <Text style={styles.actionCount}>{commentCount}</Text>
              </View>
              <View style={styles.actionItem}>
                <Pressable onPress={handleToggleScrap} hitSlop={8}>
                  <Ionicons
                    name={scraped ? "bookmark" : "bookmark-outline"}
                    size={21}
                    color={BLACK}
                  />
                </Pressable>
                <Text style={styles.actionCount}>{scrapCount}</Text>
              </View>
            </View>

          <View style={styles.commentList}>
            {displayedComments.map((comment) => (
              <View
                key={comment.id}
                style={[
                  styles.commentCard,
                  comment.isMine && styles.myCommentCard,
                ]}
              >
                <View style={styles.commentTopRow}>
                  <View style={styles.commentAuthorRow}>
                    <CommentAuthorAvatar profileImgUrl={comment.profileImgUrl} />
                    <View style={styles.commentHeaderText}>
                      <View style={styles.commentMetaRow}>
                        <Text style={styles.commentAuthor}>
                          {comment.author}
                        </Text>
                        {!!comment.createdAt && (
                          <Text style={styles.commentDate}>
                            {formatTimeAgo(comment.createdAt)}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.commentContent}>
                        {comment.content}
                      </Text>
                    </View>
                  </View>
                  {!comment.isMine && comment.authorUserId ? (
                    <ReportDotsDropdownMenu
                      enabled
                      onReport={() =>
                        openReportComment(comment.id, comment.authorUserId)
                      }
                      variant="comment"
                      disabledMessage="신고할 수 없습니다."
                    />
                  ) : comment.isMine ? (
                    <Pressable hitSlop={8} onPress={() => openOwnCommentActions(comment)}>
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={18}
                        color={GRAY.DARK_2}
                      />
                    </Pressable>
                  ) : (
                    <View style={{ width: 18 }} />
                  )}
                </View>

                <View style={styles.commentStats}>
                  <Pressable
                    onPress={() =>
                      handleToggleCommentLike(comment.id, Boolean(comment.isLiked))
                    }
                    hitSlop={8}
                  >
                    <Ionicons
                      name={comment.isLiked ? "heart" : "heart-outline"}
                      size={20}
                      color={comment.isLiked ? RED.DEFAULT : "#FFCACA"}
                    />
                  </Pressable>
                  <Text style={styles.commentCount}>{comment.likeCount}</Text>
                  {comment.replyCount > 0 && (
                    <>
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color={MAIN.DEFAULT}
                      />
                      <Text style={styles.commentCount}>
                        {comment.replyCount}
                      </Text>
                    </>
                  )}
                  <Pressable
                    onPress={() =>
                      setReplyTarget({
                        id: comment.id,
                        author: comment.author,
                      })
                    }
                    hitSlop={8}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: GRAY.DARK_2,
                        fontWeight: "600",
                        marginLeft: 2,
                      }}
                    >
                      답글달기
                    </Text>
                  </Pressable>
                </View>
                {!!comment.replies?.length && (
                  <View style={styles.replyList}>
                    {comment.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyRow}>
                        <CommentAuthorAvatar
                          profileImgUrl={reply.profileImgUrl}
                          size={24}
                          style={styles.replyAvatarCircle}
                        />
                        <View style={styles.replyBody}>
                          <View
                            style={[
                              styles.replyMetaRow,
                              { justifyContent: "space-between", flexWrap: "nowrap" },
                            ]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                                flex: 1,
                              }}
                            >
                              <Text style={styles.replyAuthor}>
                                {reply.author}
                              </Text>
                              {!!reply.createdAt && (
                                <Text style={styles.replyDate}>
                                  {formatTimeAgo(reply.createdAt)}
                                </Text>
                              )}
                            </View>
                              {!reply.isMine && reply.authorUserId ? (
                              <ReportDotsDropdownMenu
                                enabled
                                onReport={() =>
                                  openReportComment(
                                    reply.id,
                                    reply.authorUserId,
                                  )
                                }
                                variant="reply"
                                disabledMessage="신고할 수 없습니다."
                              />
                            ) : reply.isMine ? (
                              <Pressable
                                hitSlop={8}
                                onPress={() => openOwnCommentActions(reply)}
                              >
                                <MaterialCommunityIcons
                                  name="dots-vertical"
                                  size={16}
                                  color={GRAY.DARK_2}
                                />
                              </Pressable>
                            ) : null}
                          </View>
                          <Text style={styles.replyContent}>
                            {reply.content}
                          </Text>
                          <View style={styles.replyStats}>
                            <Pressable
                              onPress={() =>
                                handleToggleCommentLike(
                                  reply.id,
                                  Boolean(reply.isLiked),
                                )
                              }
                              hitSlop={8}
                            >
                              <Ionicons
                                name={reply.isLiked ? "heart" : "heart-outline"}
                                size={16}
                                color={reply.isLiked ? RED.DEFAULT : "#FFCACA"}
                              />
                            </Pressable>
                            <Text style={styles.replyCount}>
                              {reply.likeCount ?? 0}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
        </ScrollView>

        <View
          style={[
            styles.commentInputWrapper,
            { paddingBottom: commentInputBarPaddingBottom(keyboardHeight, bottom) },
          ]}
        >
          {!!replyTarget && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingTop: 4,
              }}
            >
              <Text style={{ fontSize: 12, color: GRAY.DARK_100 }}>
                {replyTarget.author}님에게 답글 작성 중
              </Text>
              <Pressable hitSlop={8} onPress={() => setReplyTarget(null)}>
                <Text style={{ fontSize: 12, color: MAIN.DEFAULT, fontWeight: "600" }}>
                  취소
                </Text>
              </Pressable>
            </View>
          )}
          <CommentInputBar
            placeholder={
              editingComment
                ? "댓글을 수정하세요"
                : replyTarget
                  ? `${replyTarget.author}님에게 답글을 입력하세요`
                  : "댓글을 입력하세요"
            }
            editMode={editingComment}
            onCancelEdit={() => setEditingComment(null)}
            onSubmit={handleCreateComment}
          />
        </View>
      </View>
      <ReportCategoryModal
        visible={reportModalVisible}
        onClose={() => !reportSubmitting && setReportModalVisible(false)}
        onSelect={handlePickReportCategory}
        submitting={reportSubmitting}
      />
    </View>
  );
};

export default MusicNewsDetailScreen;
