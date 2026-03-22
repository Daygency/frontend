import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CommunityCard from "../LoungeScreen/components/CommunityCard";
import styles from "./styles";
import { RootRoutes } from "../../navigations/routes";
import { getMyPosts } from "../../lib/apis/userPosts/myPostsApi";
import type { MyCommunityPostItem } from "../../lib/apis/userPosts/types";
import { getMyScrappedCommunity } from "../../lib/apis/scrap/scrapApi";
import type { MyScrappedCommunityItem } from "../../lib/apis/scrap/types";
import { normalizeListThumbnailUrl } from "../../lib/media/listThumbnailUrl";

type MyActivityListParams = {
  type: "posts" | "comments";
  source?: "scrap";
};

const MOCK_POSTS = [
  { id: "1", title: "교향악단 바이올린 객원단원 채용", contentPreview: "너무 떨렸는데 관객분들 반응이 좋아서 기분이 좋네", author: "신바이올린", date: "2025.11.20", likes: 45, comments: 5, scraps: 45 },
  { id: "2", title: "오케스트라 오디션 후기", contentPreview: "오늘 오디션 다녀왔어요. 긴장되다가도 무대에 서니까 좋더라구요", author: "바이올린맨", date: "2025.11.19", likes: 28, comments: 12, scraps: 15 },
  { id: "3", title: "첼로 파트 공부 방법 추천", contentPreview: "혹시 첼로 독학하시는 분 계신가요? 어떤 교재가 좋을까요", author: "첼로입문", date: "2025.11.18", likes: 67, comments: 24, scraps: 33 },
  { id: "4", title: "지방 오케스트라 활동 후기", contentPreview: "서울 말고 지방 오케스트라도 분위기가 정말 좋아요", author: "오케스트라러버", date: "2025.11.17", likes: 52, comments: 8, scraps: 22 },
  { id: "5", title: "합주실 추천해주세요", contentPreview: "4인 합주용으로 합주실 잘 아시는 분 있나요?", author: "앙상블맘", date: "2025.11.16", likes: 19, comments: 31, scraps: 7 },
  { id: "6", title: "바이올린 현 교체 주기", contentPreview: "현 얼마나 자주 갈아끼우시나요?", author: "바이올린초보", date: "2025.11.15", likes: 41, comments: 15, scraps: 18 },
  { id: "7", title: "콩쿠르 준비 조언 부탁드려요", contentPreview: "내년 청소년 콩쿠르 준비 중인데 팁 있으시면 알려주세요", author: "콩쿠르도전", date: "2025.11.14", likes: 89, comments: 42, scraps: 55 },
  { id: "8", title: "관현악단 악보 정리법", contentPreview: "악보가 너무 많아서 정리가 안 되네요. 좋은 방법 있을까요", author: "악보매니아", date: "2025.11.13", likes: 33, comments: 9, scraps: 21 },
  { id: "9", title: "신곡 공모 접수 마감 임박", contentPreview: "이번 주 금요일까지입니다. 서두르세요!", author: "음악협회", date: "2025.11.12", likes: 156, comments: 28, scraps: 92 },
  { id: "10", title: "봄 정기연주회 후기", contentPreview: "오늘 공연 정말 감동이었어요. 다들 수고많으셨어요", author: "관객1번", date: "2025.11.11", likes: 234, comments: 67, scraps: 88 },
];

const MOCK_COMMENTS = [
  { id: "c1", title: "오늘 공연 후기 모음", contentPreview: "다들 수고 많으셨습니다! 다음 공연도 기대됩니다", author: "관람객A", date: "2025.11.18", likes: 32, comments: 12, scraps: 8 },
  { id: "c2", title: "바이올린 오디션 후기", contentPreview: "정말 좋은 공연이었어요. 연주력이 대단하시네요", author: "뮤지션B", date: "2025.11.17", likes: 45, comments: 5, scraps: 12 },
  { id: "c3", title: "첼로 독주회", contentPreview: "첼로 음색이 정말 아름다웠습니다", author: "클래식팬", date: "2025.11.16", likes: 28, comments: 8, scraps: 3 },
  { id: "c4", title: "합주 경험 공유", contentPreview: "합주할 때 눈 맞추는 게 중요하다고 느꼈어요", author: "앙상블맘", date: "2025.11.15", likes: 67, comments: 23, scraps: 19 },
  { id: "c5", title: "지휘자 피드백", contentPreview: "오늘 리허설에서 배운 점이 많았어요", author: "오케스트라단원", date: "2025.11.14", likes: 52, comments: 14, scraps: 7 },
  { id: "c6", title: "악기 수리 추천", contentPreview: "여기서 수리 받으니 만족스럽습니다", author: "바이올린주인", date: "2025.11.13", likes: 38, comments: 9, scraps: 15 },
  { id: "c7", title: "연습실 정보", contentPreview: "가격 대비 괜찮은 연습실 찾았어요", author: "연습중", date: "2025.11.12", likes: 91, comments: 34, scraps: 42 },
  { id: "c8", title: "콩쿠르 수상 축하", contentPreview: "축하드려요! 수고 많으셨어요", author: "동기생", date: "2025.11.11", likes: 124, comments: 56, scraps: 28 },
  { id: "c9", title: "악보 추천 부탁", contentPreview: "초급자용 클래식 악보 추천해주세요", author: "입문자", date: "2025.11.10", likes: 29, comments: 41, scraps: 11 },
  { id: "c10", title: "정기연주회 후기", contentPreview: "올해도 좋은 공연 감사했습니다!", author: "단골관객", date: "2025.11.09", likes: 76, comments: 18, scraps: 33 },
];

type RootStackParamList = {
  MyActivityList: MyActivityListParams;
  CommunityDetail: { communityId: string };
};

type CommunityRow = {
  id: string;
  title: string;
  contentPreview: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  scraps: number;
  views?: number;
  thumbnailUrl?: string;
};

const MyActivityListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "MyActivityList">>();
  const { type, source } = route.params;
  const [myCommunityPosts, setMyCommunityPosts] = useState<MyCommunityPostItem[]>([]);
  const [scrappedCommunity, setScrappedCommunity] = useState<MyScrappedCommunityItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (type !== "posts" || source === "scrap") return;
    (async () => {
      const res = await getMyPosts();
      if (!res) {
        setMyCommunityPosts([]);
        return;
      }
      setMyCommunityPosts(res.community);
    })();
  }, [type, source]);

  useEffect(() => {
    if (type !== "posts" || source !== "scrap") return;
    (async () => {
      const res = await getMyScrappedCommunity({ limit: 20 });
      if (!res) {
        setScrappedCommunity([]);
        setNextCursor(null);
        setHasMore(false);
        return;
      }
      setScrappedCommunity(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    })();
  }, [type, source]);

  const myPostsData = useMemo(
    (): CommunityRow[] =>
      myCommunityPosts.map((item) => ({
        id: item.communityId,
        title: item.title,
        contentPreview: item.category ?? "",
        author: "나",
        date: formatDate(item.createdAt),
        likes: Number(item.likeCount ?? 0),
        comments: Number(item.commentCount ?? 0),
        scraps: 0,
        views: Number(item.viewCount ?? 0),
        thumbnailUrl: normalizeListThumbnailUrl(item.thumbnailUrl),
      })),
    [myCommunityPosts],
  );

  const scrappedPostsData = useMemo(
    (): CommunityRow[] =>
      scrappedCommunity.map((item) => ({
        id: item.communityId,
        title: item.title,
        contentPreview: item.category ?? "",
        author: "나",
        date: formatDate(item.createdAt),
        likes: Number(item.likeCount ?? 0),
        comments: Number(item.commentCount ?? 0),
        scraps: 0,
        views: Number(item.viewCount ?? 0),
        thumbnailUrl: normalizeListThumbnailUrl(item.thumbnailUrl),
      })),
    [scrappedCommunity],
  );

  const data: CommunityRow[] =
    type === "posts"
      ? source === "scrap"
        ? scrappedPostsData
        : myPostsData
      : MOCK_COMMENTS;

  const getEmptyMessage = () => {
    if (source === "scrap") return "스크랩한 글이 없습니다.";
    return type === "posts" ? "작성한 글이 없습니다." : "작성한 댓글이 없습니다.";
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommunityCard
            title={item.title}
            contentPreview={item.contentPreview}
            author={item.author}
            date={item.date}
            likes={item.likes}
            comments={item.comments}
            scraps={item.scraps}
            views={item.views}
            thumbnailUrl={item.thumbnailUrl}
            onPress={
              type === "posts"
                ? () => navigation.navigate(RootRoutes.COMMUNITY_DETAIL, { communityId: item.id })
                : undefined
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.4}
        onEndReached={async () => {
          if (type !== "posts" || source !== "scrap" || loadingMore || !hasMore) return;
          setLoadingMore(true);
          const res = await getMyScrappedCommunity({
            limit: 20,
            cursor: nextCursor ?? undefined,
          });
          if (res) {
            setScrappedCommunity((prev) => [...prev, ...res.items]);
            setNextCursor(res.nextCursor);
            setHasMore(res.hasMore);
          }
          setLoadingMore(false);
        }}
        ListFooterComponent={
          type === "posts" && source === "scrap" && loadingMore ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>불러오는 중...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
          </View>
        }
      />
    </View>
  );
};

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default MyActivityListScreen;
