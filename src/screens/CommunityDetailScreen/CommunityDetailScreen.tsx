import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
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
import { Ionicons } from "@expo/vector-icons";
import navigationHeaderStyles from "../../navigations/styles";
import CommentInputBar from "../../components/comments/CommentInputBar";
import CommentReplyTargetBar from "../../components/comments/CommentReplyTargetBar";
import CommentAuthorAvatar from "../../components/comments/CommentAuthorAvatar/CommentAuthorAvatar";
import ThreadedCommentList from "../../components/comments/ThreadedCommentList";
import ImageCarousel from "../../components/media/ImageCarousel";
import styles from "./styles";
import { getCommunityDetail, deleteCommunity } from "../../lib/apis/community/communityApi";
import type { CommunityDetailResponse } from "../../lib/apis/community/types";
import { BLACK, RED } from "../../color";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../../lib/apis/comment/commentApi";
import type { CommentItem as ApiCommentItem } from "../../lib/apis/comment/types";
import PostDetailOptionsMenu from "../../components/menus/PostDetailOptionsMenu";
import { ContentRoutes, RootRoutes } from "../../navigations/routes";
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
import { pickCommentUserProfileImgUrl } from "../../lib/apis/comment/commentUserProfile";
import {
  pickAuthorFromUser,
  pickProfileImgFromUser,
} from "../../lib/community/communityAuthor";
import CommunityDetailSkeleton from "./components/CommunityDetailSkeleton";

type CommunityDetailRouteParams = {
  communityId: string;
};

type CommunityDetailRouteProp = RouteProp<
  { CommunityDetail: CommunityDetailRouteParams },
  "CommunityDetail"
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

type ReplyTarget = {
  parentId: string;
  author: string;
};

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

function formatPostDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}. ${m}. ${day}. ${hh}:${mm}`;
}

function mapCommentToUi(comment: ApiCommentItem, myUserId?: string): CommentItem {
  const uid = String(comment.user?.userId ?? "").trim();
  const isMine = Boolean(myUserId && uid && uid === myUserId);
  return {
    id: String(comment.id),
    author: pickAuthorFromUser(
      comment.user as Record<string, unknown> | undefined,
    ),
    profileImgUrl: pickCommentUserProfileImgUrl(comment.user),
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

const CommunityDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<CommunityDetailRouteProp>();
  const { communityId } = route.params;
  const { user, isLoggedIn } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const { bottom } = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const scrollViewRef = useRef<ScrollView>(null);
  const contentAnchorRef = useRef<View>(null);
  const [data, setData] = useState<CommunityDetailResponse | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [scrollTargetCommentId, setScrollTargetCommentId] = useState<
    string | null
  >(null);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [editingComment, setEditingComment] = useState<{
    commentId: string;
    initialContent: string;
  } | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [scraped, setScraped] = useState(false);
  const [scrapCount, setScrapCount] = useState(0);
  const [isMineFromApi, setIsMineFromApi] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportPending, setReportPending] = useState<{
    reportedUserId: string;
    targetType: ReportTargetType;
    targetId: string;
  } | null>(null);
  const imageUrls = useMemo(() => {
    if (!data) return [];
    const urls = mapAttachmentsToImageUrls(data.attachments);
    const fromFile = data.file
      ? pickUrlFromFileLike(data.file as Record<string, unknown>)
      : undefined;
    return urls.length > 0 ? urls : fromFile ? [fromFile] : [];
  }, [data]);

  useEffect(() => {
    setImageIndex(0);
  }, [communityId, imageUrls.length]);

  const displayedComments = comments;
  const myUserId = user?.socialId?.trim() ?? "";
  const commentCount = Number(
    data?.commentCount ?? (data as { commentsCount?: number })?.commentsCount ?? comments.length,
  );
  const viewCount = Number(data?.viewCount ?? 0);
  const postAuthor = data ? pickAuthorFromUser(data.user) : "";
  const postProfileImg = data ? pickProfileImgFromUser(data.user) : undefined;
  const categoryName = data?.category?.name?.trim() ?? "";
  const authorUserId =
    pickReportedUserIdFromUnknown(data?.user)?.trim() ?? "";
  const isMinePost = Boolean(
    isMineFromApi ||
      (myUserId && authorUserId && myUserId.toLowerCase() === authorUserId.toLowerCase()),
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getCommunityDetail(communityId);
      setData(res);
      setIsMineFromApi(Boolean(res?.isMine));
      setLoading(false);
    })();
  }, [communityId]);

  useEffect(() => {
    (async () => {
      const res = await getComments({
        targetType: "COMMUNITY",
        targetId: communityId,
      });
      if (res) setComments(buildCommentTree(res, myUserId));
    })();
  }, [communityId, myUserId]);

  const refreshComments = useCallback(async () => {
    const res = await getComments({
      targetType: "COMMUNITY",
      targetId: communityId,
    });
    if (res) setComments(buildCommentTree(res, myUserId));
  }, [communityId, myUserId]);

  useEffect(() => {
    (async () => {
      const res = await getLikes({
        likeType: "COMMUNITY",
        targetId: communityId,
      });
      if (!res) return;
      setLikeCount(res.count);
      const myId = user?.socialId;
      setLiked(
        !!myId &&
          res.items.some((item: any) => String(item.user?.userId ?? "") === myId),
      );
    })();
  }, [communityId, user?.socialId]);

  useEffect(() => {
    (async () => {
      const res = await getScraps({
        targetType: "COMMUNITY",
        targetId: communityId,
      });
      if (!res) return;
      setScrapCount(res.count);
      const myId = user?.socialId;
      setScraped(
        !!myId &&
          res.items.some((item) => String(item.user?.userId ?? "") === myId),
      );
    })();
  }, [communityId, user?.socialId]);

  const openReportPost = useCallback(() => {
    if (!ensureLoggedIn()) return;
    if (isMinePost) {
      Alert.alert("알림", "본인이 작성한 글은 신고할 수 없습니다.");
      return;
    }
    const reportedUserId = pickReportedUserIdFromUnknown(data?.user);
    if (!reportedUserId) {
      Alert.alert("알림", "작성자 정보를 불러오지 못했습니다.");
      return;
    }
    if (reportedUserId === user?.socialId?.trim()) {
      Alert.alert("알림", "본인을 신고할 수 없습니다.");
      return;
    }
    setReportPending({
      reportedUserId,
      targetType: "COMMUNITY",
      targetId: communityId,
    });
    setReportModalVisible(true);
  }, [ensureLoggedIn, isMinePost, data?.user, user?.socialId, communityId]);

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
    !loading && Boolean(data) && !isMinePost;

  const onEditCommunity = useCallback(() => {
    navigation.navigate(
      RootRoutes.COMMUNITY_REGISTRATION as never,
      { communityId } as never,
    );
  }, [navigation, communityId]);

  const onDeleteCommunity = useCallback(() => {
    Alert.alert("삭제", "이 게시글을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const res = await deleteCommunity(communityId);
          if (res.ok) {
            navigation.goBack();
          } else {
            Alert.alert("알림", "삭제에 실패했습니다.");
          }
        },
      },
    ]);
  }, [communityId, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text style={styles.navTitle}>커뮤니티</Text>
        </View>
      ),
      headerRight: () => (
        <View style={navigationHeaderStyles.rightItemsWrap}>
          {isMinePost ? (
            <PostDetailOptionsMenu
              isMine
              loading={loading}
              onEdit={onEditCommunity}
              onDelete={onDeleteCommunity}
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
    isMinePost,
    onEditCommunity,
    onDeleteCommunity,
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
    if (liked) {
      const res = await deleteLikeByTarget({
        likeType: "COMMUNITY",
        targetId: communityId,
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
      likeType: "COMMUNITY",
      targetId: communityId,
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
    if (scraped) {
      const res = await deleteScrapByTarget({
        targetType: "COMMUNITY",
        targetId: communityId,
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
      targetType: "COMMUNITY",
      targetId: communityId,
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
    const replyContent = replyTarget
      ? content.trim().startsWith(`@${replyTarget.author}`)
        ? content
        : `@${replyTarget.author} ${content}`
      : content;
    const created = await createComment({
      content: replyContent,
      targetType: "COMMUNITY",
      targetId: communityId,
      parentId: replyTarget?.parentId,
    });
    if (!created) {
      Alert.alert("알림", "댓글 작성에 실패했습니다.");
      return;
    }
    await refreshComments();
    setReplyTarget(null);
    setScrollTargetCommentId(String(created.id));
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

  const navigateToCommentAuthorProfile = useCallback(
    (authorUserId?: string, activityName?: string) => {
      const uid = authorUserId?.trim();
      if (!uid) return;

      if (myUserId && uid.toLowerCase() === myUserId.toLowerCase()) {
        navigation.navigate(
          RootRoutes.CONTENT_TAB as never,
          { screen: ContentRoutes.LOUNGE } as never,
        );
        return;
      }

      navigation.navigate(
        RootRoutes.ARTIST_PORTFOLIO as never,
        {
          userId: uid,
          activityName: activityName?.trim() ?? "",
        } as never,
      );
    },
    [myUserId, navigation],
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
      <View style={styles.container}>
        <View style={styles.detailInner}>
          <ScrollView
            style={styles.detailScroll}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <CommunityDetailSkeleton />
          </ScrollView>

          <View
            style={[
              styles.commentInputContainer,
              { paddingBottom: commentInputBarPaddingBottom(keyboardHeight, bottom) },
            ]}
          >
            <CommentInputBar
              placeholder="댓글을 입력해주세요"
              onSubmit={handleCreateComment}
            />
          </View>
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <View style={[styles.scrollContent, { alignItems: "center", justifyContent: "center" }]}>
          <Text>게시글을 불러오지 못했습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.detailInner}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.detailScroll}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View ref={contentAnchorRef}>
        <View style={styles.postSection}>
          {!!categoryName && (
            <Text style={styles.categoryText}>{categoryName}</Text>
          )}

          {!!data.title?.trim() && (
            <Text style={styles.postTitleLarge}>{data.title}</Text>
          )}

          <View style={styles.authorMetaRow}>
            <Pressable
              onPress={() =>
                navigateToCommentAuthorProfile(authorUserId, postAuthor)
              }
              disabled={!authorUserId}
              hitSlop={8}
            >
              <CommentAuthorAvatar
                profileImgUrl={postProfileImg}
                size={40}
              />
            </Pressable>
            <View style={styles.authorMetaText}>
              <Pressable
                onPress={() =>
                  navigateToCommentAuthorProfile(authorUserId, postAuthor)
                }
                disabled={!authorUserId}
                hitSlop={8}
              >
                <Text style={styles.authorName}>{postAuthor}</Text>
              </Pressable>
              <Text style={styles.postDate}>
                {formatPostDate(data.createdAt)}
              </Text>
            </View>
            {viewCount > 0 ? (
              <Text style={styles.viewCount}>
                조회 {viewCount.toLocaleString()}회
              </Text>
            ) : null}
          </View>

          <View style={styles.contentDivider} />

          {!!data.content?.trim() && (
            <Text style={styles.postBody}>{data.content}</Text>
          )}

          {imageUrls.length > 0 ? (
            <View style={styles.carouselWrap}>
              <ImageCarousel
                gap={0}
                images={imageUrls}
                fitImageHeight
                onActiveIndexChange={setImageIndex}
              />
              {imageUrls.length > 1 ? (
                <View style={styles.pageBadge} pointerEvents="none">
                  <Text style={styles.pageBadgeText}>
                    {imageIndex + 1}/{imageUrls.length}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={styles.actionRow}>
            <View style={styles.actionItem}>
              <Pressable onPress={handleToggleLike} hitSlop={8}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={22}
                  color={liked ? RED.DEFAULT : BLACK}
                />
              </Pressable>
              <Text style={styles.actionCount}>{likeCount}</Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={BLACK}
              />
              <Text style={styles.actionCount}>{commentCount}</Text>
            </View>
            <View style={styles.actionItem}>
              <Pressable onPress={handleToggleScrap} hitSlop={8}>
                <Ionicons
                  name={scraped ? "bookmark" : "bookmark-outline"}
                  size={22}
                  color={scraped ? BLACK : BLACK}
                />
              </Pressable>
              <Text style={styles.actionCount}>{scrapCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <ThreadedCommentList
          comments={displayedComments}
          formatTimeAgo={formatTimeAgo}
          onPressAuthor={navigateToCommentAuthorProfile}
          onToggleLike={handleToggleCommentLike}
          onReply={(parentId, author) => setReplyTarget({ parentId, author })}
          onReport={openReportComment}
          onOpenOwnActions={openOwnCommentActions}
          scrollViewRef={scrollViewRef}
          scrollAnchorRef={contentAnchorRef}
          scrollTargetId={scrollTargetCommentId}
          onScrollTargetHandled={() => setScrollTargetCommentId(null)}
        />
        </View>
        </ScrollView>

        <View
          style={[
            styles.commentInputContainer,
            { paddingBottom: commentInputBarPaddingBottom(keyboardHeight, bottom) },
          ]}
        >
          {!!replyTarget && (
            <CommentReplyTargetBar
              author={replyTarget.author}
              onCancel={() => setReplyTarget(null)}
            />
          )}
          <CommentInputBar
            placeholder={
              editingComment
                ? "댓글을 수정하세요"
                : replyTarget
                  ? `${replyTarget.author}님에게 답글을 입력해주세요`
                  : "댓글을 입력해주세요"
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

export default CommunityDetailScreen;
