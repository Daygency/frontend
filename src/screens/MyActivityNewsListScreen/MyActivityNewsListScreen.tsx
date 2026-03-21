import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View, useWindowDimensions } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EventNewsCard from "../../components/EventNewsCard/EventNewsCard";
import styles from "./styles";
import { getMyScrappedNews } from "../../lib/apis/scrap/scrapApi";
import type { MyScrappedNewsItem } from "../../lib/apis/scrap/types";
import { RootRoutes } from "../../navigations/routes";

const IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s";

const MOCK_NEWS = [
  { id: "1", title: "교향악단 바이올린 객원단원 채용 공연", place: "예술의전당", dateRange: "2025.11.20 ~ 2025.12.15", imageUrl: IMAGE_URL },
  { id: "2", title: "봄 정기연주회", place: "세종문화회관", dateRange: "2025.03.10 ~ 2025.03.12", imageUrl: IMAGE_URL },
  { id: "3", title: "청소년 콩쿠르 본선", place: "토끼마을 콘서트홀", dateRange: "2000.05.16 ~ 2003.07.15", imageUrl: IMAGE_URL },
  { id: "4", title: "첼로 독주회", place: "롯데콘서트홀", dateRange: "2025.04.01 ~ 2025.04.03", imageUrl: IMAGE_URL },
  { id: "5", title: "오케스트라 정기공연", place: "예술의전당", dateRange: "2025.05.20 ~ 2025.05.22", imageUrl: IMAGE_URL },
  { id: "6", title: "앙상블 페스티벌", place: "세종문화회관", dateRange: "2025.06.15 ~ 2025.06.17", imageUrl: IMAGE_URL },
  { id: "7", title: "여름 음악축제", place: "잠실 체조경기장", dateRange: "2025.07.25 ~ 2025.07.27", imageUrl: IMAGE_URL },
  { id: "8", title: "오페라 갈라 콘서트", place: "국립오페라극장", dateRange: "2025.08.10 ~ 2025.08.12", imageUrl: IMAGE_URL },
  { id: "9", title: "가을 실내악 축제", place: "예술의전당", dateRange: "2025.09.20 ~ 2025.09.22", imageUrl: IMAGE_URL },
  { id: "10", title: "겨울 송년 연주회", place: "롯데콘서트홀", dateRange: "2025.12.28 ~ 2025.12.29", imageUrl: IMAGE_URL },
];

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;

type MyActivityNewsListParams = {
  source?: "scrap";
};

type RootStackParamList = {
  MyActivityNewsList: MyActivityNewsListParams | undefined;
  MusicNewsDetail: { newsId: string };
};

const MyActivityNewsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const cardWidth = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
  const route = useRoute<RouteProp<RootStackParamList, "MyActivityNewsList">>();
  const source = route.params?.source;
  const [scrappedNews, setScrappedNews] = useState<MyScrappedNewsItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const emptyMessage =
    source === "scrap" ? "스크랩한 공연 소식이 없습니다." : "공연 소식이 없습니다.";

  useEffect(() => {
    if (source !== "scrap") return;
    (async () => {
      setLoadingInitial(true);
      const res = await getMyScrappedNews({ limit: 20 });
      if (!res) {
        setScrappedNews([]);
        setNextCursor(null);
        setHasMore(false);
        setLoadingInitial(false);
        return;
      }
      setScrappedNews(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
      setLoadingInitial(false);
    })();
  }, [source]);

  const data = useMemo(
    () =>
      source === "scrap"
        ? scrappedNews.map((item) => ({
            id: item.newsId,
            newsId: item.newsId,
            title: item.title,
            place: item.place ?? "",
            dateRange: formatDate(item.createdAt),
            imageUrl: IMAGE_URL,
          }))
        : MOCK_NEWS.map((item) => ({
            ...item,
            newsId: item.id,
          })),
    [source, scrappedNews],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <EventNewsCard
              title={item.title}
              place={item.place}
              dateRange={item.dateRange}
              imageUrl={item.imageUrl}
              width={cardWidth}
              height={138}
              onPress={() =>
                navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, {
                  newsId: item.newsId,
                })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        }
        onEndReachedThreshold={0.4}
        onEndReached={async () => {
          if (
            source !== "scrap" ||
            loadingInitial ||
            loadingMore ||
            !hasMore ||
            !nextCursor
          ) {
            return;
          }
          setLoadingMore(true);
          const res = await getMyScrappedNews({
            limit: 20,
            cursor: nextCursor ?? undefined,
          });
          if (res) {
            setScrappedNews((prev) => {
              const seen = new Set(prev.map((item) => item.scrapId));
              const appended = res.items.filter((item) => !seen.has(item.scrapId));
              return [...prev, ...appended];
            });
            setNextCursor(res.nextCursor);
            setHasMore(res.hasMore);
          }
          setLoadingMore(false);
        }}
        ListFooterComponent={
          source === "scrap" && loadingMore ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>불러오는 중...</Text>
            </View>
          ) : null
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

export default MyActivityNewsListScreen;
