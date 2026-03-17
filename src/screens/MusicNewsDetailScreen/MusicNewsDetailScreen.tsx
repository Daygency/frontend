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
import { BLACK, GRAY, WHITE } from "../../color";
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

function resolveFileUrl(file?: { url?: string } | null): string | undefined {
  const url = file?.url;
  if (!url) return undefined;
  if (url.startsWith("/")) return `${API_BASE}${url}`;
  return url;
}

function mapApiToItem(res: NewsDetailResponse): MusicNewsDetailItem {
  const d = new Date(res.startedAt);
  const dateStr =
    isNaN(d.getTime()) ? res.startedAt : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  const timeStr =
    isNaN(d.getTime()) ? "" : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const createdD = new Date(res.createdAt);
  const uploadedStr =
    isNaN(createdD.getTime())
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
  };
}

const MusicNewsDetailScreen = () => {
  const route = useRoute<MusicNewsDetailRouteProp>();
  const { bottom } = useSafeAreaInsets();
  const newsId = route.params?.newsId;
  const newsFromParams = route.params?.news;

  const [news, setNews] = useState<MusicNewsDetailItem | null>(newsFromParams ?? null);
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", flex: 1 }]}>
        <ActivityIndicator size="large" color={GRAY.DARK} />
        <Text style={{ marginTop: 12, fontSize: 14, color: GRAY.DARK_2 }}>공연소식을 불러오는 중...</Text>
      </View>
    );
  }

  if (error || !news) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", flex: 1 }]}>
        <Text style={{ fontSize: 14, color: GRAY.DARK_2, textAlign: "center" }}>{error ?? "정보를 불러올 수 없습니다."}</Text>
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
              uri: news.imageUrl || "https://via.placeholder.com/400x240?text=CLASSIC+ARTIST+CONCERT",
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
                <MaterialCommunityIcons name="account-outline" size={18} color={GRAY.DARK} />
                <Text style={styles.infoText}>{news.authorId}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar-outline" size={18} color={GRAY.DARK} />
              <Text style={styles.infoText}>예정일 : {news.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={GRAY.DARK} />
              <Text style={styles.infoText}>예정 시간 : {news.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={GRAY.DARK} />
              <Text style={styles.infoText}>장소: {news.place}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone-outline" size={18} color={GRAY.DARK} />
              <Text style={styles.infoText}>문의: {news.contact}</Text>
            </View>
          </View>

          <Text style={styles.description}>{news.description}</Text>

          {news.attachments && news.attachments.length > 0 && (
            <View style={styles.attachmentsCard}>
              <Text style={styles.attachmentsTitle}>첨부파일</Text>
              {news.attachments.map((file, index) => (
                <Pressable key={index} style={styles.fileRow}>
                  <MaterialCommunityIcons name="paperclip" size={18} color={GRAY.DARK} />
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>{file.size}</Text>
                  <MaterialCommunityIcons name="download" size={20} color={GRAY.DARK} />
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.statsRow}>
            <MaterialCommunityIcons name="heart-outline" size={18} color={GRAY.DARK} />
            <Text style={styles.statText}>좋아요 {news.likes}</Text>
            <MaterialCommunityIcons name="comment-outline" size={18} color={GRAY.DARK} style={styles.statIcon} />
            <Text style={styles.statText}>댓글 {news.comments}</Text>
          </View>

          <View style={styles.firstCommentPlaceholder}>
            <Text style={styles.firstCommentText}>첫 댓글을 남겨보세요.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.commentInputWrapper, { paddingBottom: (bottom || 0) + 10 }]}>
        <CommentInputBar placeholder="댓글을 입력하세요" />
      </View>
    </View>
  );
};

export default MusicNewsDetailScreen;
