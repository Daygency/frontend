import { useCallback, useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
  Pressable,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../color";
import { Ionicons } from "@expo/vector-icons";
import CommentInputBar from "../../components/CommentInputBar/CommentInputBar";
import { getNewsDetail } from "../../lib/apis/news/newsApi";
import type { NewsDetailResponse } from "../../lib/apis/news/types";
import { API_BASE } from "../../lib/apis/api";
import styles from "./styles";

export type MusicNewsDetailItem = {
  id: string;
  title: string;
  place: string;
  date: string;
  time: string;
  contact: string;
  authorId?: string;
  uploadedAt: string;
  description: string;
  imageUrl?: string;
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
  id: "dummy-news-comment",
  author: "익명1",
  createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  content: "축하드려요! 저도 다음에 도전해봐야겠어요",
  likeCount: 5,
  replyCount: 1,
  isLiked: true,
  isMine: true,
  replies: [
    {
      id: "dummy-news-reply-1",
      author: "익명2",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      content: "저도 응원해요! 좋은 결과 있길 바라요 :)",
      likeCount: 2,
      isLiked: false,
    },
  ],
};

function resolveFileUrl(file?: { url?: string } | null): string | undefined {
  const url = file?.url;
  if (!url) return undefined;
  if (url.startsWith("/")) return `${API_BASE}${url}`;
  return url;
}

function mapApiToItem(res: NewsDetailResponse): MusicNewsDetailItem {
  const d = new Date(res.startedAt);
  const dateStr = isNaN(d.getTime())
    ? res.startedAt
    : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  const timeStr = isNaN(d.getTime())
    ? ""
    : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const createdD = new Date(res.createdAt);
  const uploadedStr = isNaN(createdD.getTime())
    ? res.createdAt
    : `${createdD.getFullYear()}.${String(createdD.getMonth() + 1).padStart(2, "0")}.${String(createdD.getDate()).padStart(2, "0")}`;

  return {
    id: res.newsId,
    title: res.title,
    place: res.place,
    date: dateStr,
    time: timeStr || "00:00",
    contact: res.contact,
    authorId: res.user?.nickname ?? res.user?.userId,
    uploadedAt: uploadedStr,
    description: res.content,
    imageUrl: resolveFileUrl(res.file),
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
            id: String(
              r.replyId ?? r.id ?? `${c.commentId ?? c.id ?? index}-r-${rIdx}`,
            ),
            author: String(
              r?.user?.nickname ?? r?.nickname ?? r?.author ?? "익명",
            ),
            createdAt: String(r?.createdAt ?? ""),
            content: String(r?.content ?? ""),
            likeCount: Number(r?.likeCount ?? r?.likes ?? 0),
            isLiked: Boolean(r?.isLiked),
          }))
        : undefined,
    };
  });
}

const MusicNewsDetailScreen = () => {
  const route = useRoute<MusicNewsDetailRouteProp>();
  const { bottom } = useSafeAreaInsets();
  const newsId = route.params?.newsId;
  const newsFromParams = route.params?.news;

  const [news, setNews] = useState<MusicNewsDetailItem | null>(
    newsFromParams ?? null,
  );
  const [loading, setLoading] = useState(!!newsId);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!newsId) return;
    setLoading(true);
    setError(null);
    const res = await getNewsDetail(newsId);
    setLoading(false);
    if (res) {
      setNews(mapApiToItem(res));
    } else {
      setError("공연소식을 불러오지 못했습니다.");
    }
  }, [newsId]);

  useEffect(() => {
    if (newsId) {
      fetchDetail();
    }
  }, [newsId, fetchDetail]);

  const { width } = Dimensions.get("window");
  const comments = normalizeComments(news?.commentsData);
  const displayedComments = comments.length > 0 ? comments : [DUMMY_COMMENT];
  const likeCount = Number((news as any)?.likeCount ?? news?.likes ?? 0);
  const commentCount = Number(
    (news as any)?.commentCount ?? news?.comments ?? comments.length,
  );
  const scrapCount = Number(
    (news as any)?.scrapCount ?? (news as any)?.bookmarks ?? 0,
  );

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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.posterWrapper}>
          <Image
            source={{
              uri:
                news.imageUrl ||
                "https://via.placeholder.com/400x240?text=CLASSIC+ARTIST+CONCERT",
            }}
            style={[styles.posterImage, { width, height: width * 0.6 }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{news.title}</Text>
            <Text style={styles.uploadedAt}>{news.uploadedAt}</Text>
          </View>

          <View style={styles.infoCard}>
            {news.authorId && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={18}
                  color={GRAY.DARK}
                />
                <Text style={styles.infoText}>{news.authorId}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={18}
                color={GRAY.DARK}
              />
              <Text style={styles.infoText}>예정일 : {news.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={18}
                color={GRAY.DARK}
              />
              <Text style={styles.infoText}>예정 시간 : {news.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={18}
                color={GRAY.DARK}
              />
              <Text style={styles.infoText}>장소: {news.place}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={18}
                color={GRAY.DARK}
              />
              <Text style={styles.infoText}>문의: {news.contact}</Text>
            </View>
          </View>

          <Text style={styles.description}>{news.description}</Text>

          {news.attachments && news.attachments.length > 0 && (
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
          )}

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
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={GRAY.MEDIUM}
                      />
                    </View>
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
                  <Ionicons
                    name="ellipsis-vertical"
                    size={18}
                    color={MAIN.DEFAULT}
                  />
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
                </View>
                {!!comment.replies?.length && (
                  <View style={styles.replyList}>
                    {comment.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyRow}>
                        <View style={styles.replyAvatarCircle}>
                          <Ionicons
                            name="person-outline"
                            size={14}
                            color={GRAY.MEDIUM}
                          />
                        </View>
                        <View style={styles.replyBody}>
                          <View style={styles.replyMetaRow}>
                            <Text style={styles.replyAuthor}>
                              {reply.author}
                            </Text>
                            {!!reply.createdAt && (
                              <Text style={styles.replyDate}>
                                {formatTimeAgo(reply.createdAt)}
                              </Text>
                            )}
                          </View>
                          <Text style={styles.replyContent}>
                            {reply.content}
                          </Text>
                          <View style={styles.replyStats}>
                            <Ionicons
                              name={reply.isLiked ? "heart" : "heart-outline"}
                              size={16}
                              color={reply.isLiked ? RED.DEFAULT : "#FFCACA"}
                            />
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
          { paddingBottom: bottom || 16 },
        ]}
      >
        <CommentInputBar placeholder="댓글을 입력하세요" />
      </View>
    </View>
  );
};

export default MusicNewsDetailScreen;
