import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import navigationHeaderStyles from "../../navigations/styles";
import CommentInputBar from "../../components/CommentInputBar/CommentInputBar";
import styles from "./styles";
import { getCommunityDetail } from "../../lib/apis/community/communityApi";
import type { CommunityDetailResponse } from "../../lib/apis/community/types";
import { BLACK, GRAY, MAIN, RED } from "../../color";
import {
  createComment,
  getComments,
} from "../../lib/apis/comment/commentApi";
import type { CommentItem as ApiCommentItem } from "../../lib/apis/comment/types";
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
import ReportCategoryModal from "../../components/ReportCategoryModal/ReportCategoryModal";
import ReportDotsDropdownMenu from "../../components/ReportDotsDropdownMenu/ReportDotsDropdownMenu";
import { createReport } from "../../lib/apis/report/reportApi";
import type { ReportCategory, ReportTargetType } from "../../lib/apis/report/types";
import { messageForReportHttpStatus } from "../../lib/report/reportErrorMessage";
import { confirmReportSubmission } from "../../lib/report/confirmReportSubmission";
import { pickReportedUserIdFromUnknown } from "../../lib/report/pickReportedUserId";
import {
  mapAttachmentsToImageUrls,
  pickUrlFromFileLike,
} from "../../lib/media/attachmentImageUrl";

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
    createdAt?: string;
    content: string;
    likeCount?: number;
    isLiked?: boolean;
    isMine?: boolean;
    authorUserId?: string;
  }>;
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

function mapCommentToUi(comment: ApiCommentItem): CommentItem {
  const uid = String(comment.user?.userId ?? "").trim();
  return {
    id: String(comment.id),
    author: String(comment.user?.nickname ?? "익명"),
    createdAt: String(comment.createdAt ?? ""),
    content: String(comment.content ?? ""),
    likeCount: Number((comment as any)?.likeCount ?? 0),
    replyCount: 0,
    isLiked: Boolean((comment as any)?.isLiked),
    isMine: Boolean((comment as any)?.isMine),
    ...(uid ? { authorUserId: uid } : {}),
    replies: [],
  };
}

function buildCommentTree(raw: ApiCommentItem[]): CommentItem[] {
  const roots: CommentItem[] = [];
  const childrenByParent = new Map<string, CommentItem[]>();

  raw.forEach((comment) => {
    const ui = mapCommentToUi(comment);
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
  const navigation = useNavigation();
  const route = useRoute<CommunityDetailRouteProp>();
  const { communityId } = route.params;
  const { user, isLoggedIn } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const [data, setData] = useState<CommunityDetailResponse | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [replyTarget, setReplyTarget] = useState<{ id: string; author: string } | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [scraped, setScraped] = useState(false);
  const [scrapCount, setScrapCount] = useState(0);
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
  const displayedComments = comments;
  const commentCount = Number(
    (data as any)?.commentCount ?? (data as any)?.commentsCount ?? comments.length
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getCommunityDetail(communityId);
      setData(res);
      setLoading(false);
    })();
  }, [communityId]);

  useEffect(() => {
    (async () => {
      const res = await getComments({
        targetType: "COMMUNITY",
        targetId: communityId,
      });
      if (res) setComments(buildCommentTree(res));
    })();
  }, [communityId]);

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
          res.items.some((item) => String(item.user?.userId ?? "") === myId),
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
    if (!isLoggedIn) {
      Alert.alert("알림", "로그인 후 신고할 수 있습니다.");
      return;
    }
    if (data?.isMine) {
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
  }, [isLoggedIn, data?.isMine, data?.user, user?.socialId, communityId]);

  const openReportComment = useCallback(
    (targetId: string, reportedUserId: string | undefined) => {
      if (!isLoggedIn) {
        Alert.alert("알림", "로그인 후 신고할 수 있습니다.");
        return;
      }
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

  /** 타인 글이면 ⋮ 메뉴 표시 — 작성자 id는 API 정규화·openReportPost에서 처리 */
  const canOpenPostReportMenu =
    !loading && Boolean(data) && !data?.isMine;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={navigationHeaderStyles.rightItemsWrap}>
          <Pressable hitSlop={10}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={21}
              color="#000"
            />
          </Pressable>
          <Pressable hitSlop={10}>
            <MaterialCommunityIcons
              name="share-variant"
              size={21}
              color="#000"
            />
          </Pressable>
          <ReportDotsDropdownMenu
            enabled={canOpenPostReportMenu}
            loading={loading}
            onReport={openReportPost}
            variant="header"
          />
        </View>
      ),
    });
  }, [navigation, loading, canOpenPostReportMenu, openReportPost]);

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
    const created = await createComment({
      content,
      targetType: "COMMUNITY",
      targetId: communityId,
      parentId: replyTarget?.id,
    });
    if (!created) {
      Alert.alert("알림", "댓글 작성에 실패했습니다.");
      return;
    }
    const res = await getComments({
      targetType: "COMMUNITY",
      targetId: communityId,
    });
    if (res) setComments(buildCommentTree(res));
    setReplyTarget(null);
  };

  const handleToggleCommentLike = async (targetId: string, currentLiked: boolean) => {
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
        <View style={[styles.scrollContent, { alignItems: "center", justifyContent: "center" }]}>
          <ActivityIndicator />
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={styles.detailInner}>
        <ScrollView
          style={styles.detailScroll}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{data.category?.name}</Text>
          </View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.meta}>
            {data.user && (data.user as any).nickname
              ? String((data.user as any).nickname)
              : "알수없음"}{" "}
            · {new Date(data.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.bodyText}>{data.content}</Text>
        </View>

        {imageUrls.length > 0 ? (
          <View style={styles.imageGallery}>
            {imageUrls.map((uri, idx) => (
              <Image
                key={`${uri}-${idx}`}
                source={{ uri }}
                style={styles.contentImage}
                resizeMode="cover"
              />
            ))}
          </View>
        ) : null}

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
                size={20}
                color="#FFC107"
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
                    <View style={styles.avatarCircle}>
                      <Ionicons name="person-outline" size={18} color={GRAY.MEDIUM} />
                    </View>
                    <View style={styles.commentHeaderText}>
                      <View style={styles.commentMetaRow}>
                        <Text style={styles.commentAuthor}>{comment.author}</Text>
                        {!!comment.createdAt && (
                          <Text style={styles.commentDate}>{formatTimeAgo(comment.createdAt)}</Text>
                        )}
                      </View>
                      <Text style={styles.commentContent}>{comment.content}</Text>
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
                      <Ionicons name="chatbubble-outline" size={18} color={MAIN.DEFAULT} />
                      <Text style={styles.commentCount}>{comment.replyCount}</Text>
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
                    <Text style={styles.replyActionText}>답글달기</Text>
                  </Pressable>
                </View>
                {!!comment.replies?.length && (
                  <View style={styles.replyList}>
                    {comment.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyRow}>
                        <View style={styles.replyAvatarCircle}>
                          <Ionicons name="person-outline" size={14} color={GRAY.MEDIUM} />
                        </View>
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
                              <Text style={styles.replyAuthor}>{reply.author}</Text>
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
                            ) : null}
                          </View>
                          <Text style={styles.replyContent}>{reply.content}</Text>
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
                            <Text style={styles.replyCount}>{reply.likeCount ?? 0}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
          ))}
        </View>
        </ScrollView>

        <View
          style={[
            styles.commentInputContainer,
            { paddingBottom: bottom || 16 },
          ]}
        >
          {!!replyTarget && (
            <View style={styles.replyComposerInfo}>
              <Text style={styles.replyComposerText}>
                {replyTarget.author}님에게 답글 작성 중
              </Text>
              <Pressable hitSlop={8} onPress={() => setReplyTarget(null)}>
                <Text style={styles.replyComposerCancel}>취소</Text>
              </Pressable>
            </View>
          )}
          <CommentInputBar
            placeholder={
              replyTarget
                ? `${replyTarget.author}님에게 답글을 입력해주세요`
                : "댓글을 입력해주세요"
            }
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
    </KeyboardAvoidingView>
  );
};

export default CommunityDetailScreen;
