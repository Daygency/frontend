import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import CommentInputBar from "../../components/CommentInputBar/CommentInputBar";
import styles from "./styles";
import { getCommunityDetail } from "../../lib/apis/community/communityApi";
import type { CommunityDetailResponse } from "../../lib/apis/community/types";
import { BLACK, GRAY, MAIN, RED } from "../../color";

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
  replies?: Array<{
    id: string;
    author: string;
    createdAt?: string;
    content: string;
    likeCount?: number;
    isLiked?: boolean;
  }>;
};

const DUMMY_COMMENT: CommentItem = {
  id: "dummy-community-comment",
  author: "익명1",
  createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  content: "축하드려요! 저도 다음에 도전해봐야겠어요",
  likeCount: 5,
  replyCount: 1,
  isLiked: true,
  isMine: true,
  replies: [
    {
      id: "dummy-community-reply-1",
      author: "익명2",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      content: "저도 응원해요! 좋은 결과 있길 바라요 :)",
      likeCount: 2,
      isLiked: false,
    },
  ],
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

function normalizeComments(raw: unknown): CommentItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const c = (item ?? {}) as Record<string, any>;
    const user = (c.user ?? {}) as Record<string, any>;
    return {
      id: String(c.commentId ?? c.id ?? index),
      author: String(user.nickname ?? c.nickname ?? c.author ?? "익명"),
      createdAt: String(c.createdAt ?? ""),
      content: String(c.content ?? ""),
      likeCount: Number(c.likeCount ?? c.likes ?? 0),
      replyCount: Number(c.replyCount ?? c.replies ?? 0),
      isLiked: Boolean(c.isLiked),
      isMine: Boolean(c.isMine),
      replies: Array.isArray(c.replies)
        ? c.replies.map((r: any, rIdx: number) => ({
            id: String(r.replyId ?? r.id ?? `${c.commentId ?? c.id ?? index}-r-${rIdx}`),
            author: String(r?.user?.nickname ?? r?.nickname ?? r?.author ?? "익명"),
            createdAt: String(r?.createdAt ?? ""),
            content: String(r?.content ?? ""),
            likeCount: Number(r?.likeCount ?? r?.likes ?? 0),
            isLiked: Boolean(r?.isLiked),
          }))
        : undefined,
    };
  });
}

const CommunityDetailScreen = () => {
  const route = useRoute<CommunityDetailRouteProp>();
  const { communityId } = route.params;
  const { bottom } = useSafeAreaInsets();
  const [data, setData] = useState<CommunityDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const comments = normalizeComments((data as any)?.comments);
  const displayedComments = comments.length > 0 ? comments : [DUMMY_COMMENT];
  const likeCount = Number((data as any)?.likeCount ?? (data as any)?.likes ?? 0);
  const commentCount = Number(
    (data as any)?.commentCount ?? (data as any)?.commentsCount ?? comments.length
  );
  const scrapCount = Number((data as any)?.scrapCount ?? (data as any)?.bookmarks ?? 0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getCommunityDetail(communityId);
      setData(res);
      setLoading(false);
    })();
  }, [communityId]);

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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
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
        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <Ionicons name="heart-outline" size={21} color={RED.DEFAULT} />
            <Text style={styles.actionCount}>{likeCount}</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={19} color={BLACK} />
            <Text style={styles.actionCount}>{commentCount}</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="bookmark-outline" size={20} color="#FFC107" />
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
                  <Ionicons name="ellipsis-vertical" size={18} color={MAIN.DEFAULT} />
                </View>

                <View style={styles.commentStats}>
                  <Ionicons
                    name={comment.isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={comment.isLiked ? RED.DEFAULT : "#FFCACA"}
                  />
                  <Text style={styles.commentCount}>{comment.likeCount}</Text>
                  {comment.replyCount > 0 && (
                    <>
                      <Ionicons name="chatbubble-outline" size={18} color={MAIN.DEFAULT} />
                      <Text style={styles.commentCount}>{comment.replyCount}</Text>
                    </>
                  )}
                </View>
                {!!comment.replies?.length && (
                  <View style={styles.replyList}>
                    {comment.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyRow}>
                        <View style={styles.replyElbow} />
                        <View style={styles.replyAvatarCircle}>
                          <Ionicons name="person-outline" size={14} color={GRAY.MEDIUM} />
                        </View>
                        <View style={styles.replyBody}>
                          <View style={styles.replyMetaRow}>
                            <Text style={styles.replyAuthor}>{reply.author}</Text>
                            {!!reply.createdAt && (
                              <Text style={styles.replyDate}>{formatTimeAgo(reply.createdAt)}</Text>
                            )}
                          </View>
                          <Text style={styles.replyContent}>{reply.content}</Text>
                          <View style={styles.replyStats}>
                            <Ionicons
                              name={reply.isLiked ? "heart" : "heart-outline"}
                              size={16}
                              color={reply.isLiked ? RED.DEFAULT : "#FFCACA"}
                            />
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
        <CommentInputBar placeholder="댓글을 입력해주세요" />
      </View>
    </View>
  );
};

export default CommunityDetailScreen;
