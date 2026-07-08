import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EventNewsCard from "../../components/cards/EventNewsCard";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import styles from "./styles";
import { getMyScrappedNews } from "../../lib/apis/scrap/scrapApi";
import type { MyScrappedNewsItem } from "../../lib/apis/scrap/types";
import { getMyLikedNews } from "../../lib/apis/like/myLikesApi";
import type { MyLikedNewsItem } from "../../lib/apis/like/types";
import { getMyNewsPosts } from "../../lib/apis/userPosts/myPostsApi";
import type { MyNewsPostItem } from "../../lib/apis/userPosts/types";
import { RootRoutes } from "../../navigations/routes";
import { normalizeListThumbnailUrl } from "../../lib/media/listThumbnailUrl";

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;

type NewsListRow = {
  id: string;
  newsId: string;
  title: string;
  place: string;
  dateRange: string;
  imageUrl?: string;
};

type MyActivityNewsListParams = {
  source?: "scrap" | "like";
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
  const [likedNews, setLikedNews] = useState<MyLikedNewsItem[]>([]);
  const [myNews, setMyNews] = useState<MyNewsPostItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const emptyMessage =
    source === "scrap"
      ? "스크랩한 공연 소식이 없습니다."
      : source === "like"
        ? "좋아요한 공연 소식이 없습니다."
        : "공연 소식이 없습니다.";

  const fetchFirst = useCallback(async () => {
    if (source === "like") {
      const res = await getMyLikedNews({ limit: 20 });
      if (!res) {
        setLikedNews([]);
        setNextCursor(null);
        setHasMore(false);
        return;
      }
      setLikedNews(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
      return;
    }

    if (source === "scrap") {
      const res = await getMyScrappedNews({ limit: 20 });
      if (!res) {
        setScrappedNews([]);
        setNextCursor(null);
        setHasMore(false);
        return;
      }
      setScrappedNews(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
      return;
    }

    const res = await getMyNewsPosts({ limit: 20 });
    if (!res) {
      setMyNews([]);
      setNextCursor(null);
      setHasMore(false);
      return;
    }
    setMyNews(res.items);
    setNextCursor(res.nextCursor);
    setHasMore(res.hasMore);
  }, [source]);

  useEffect(() => {
    (async () => {
      setLoadingInitial(true);
      await fetchFirst();
      setLoadingInitial(false);
    })();
  }, [fetchFirst]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFirst();
    setRefreshing(false);
  }, [fetchFirst]);

  const data = useMemo((): NewsListRow[] => {
    if (source === "like") {
      return likedNews.map((item) => ({
        id: item.newsId,
        newsId: item.newsId,
        title: item.title,
        place: item.place ?? "",
        dateRange: formatDate(item.createdAt),
        imageUrl: normalizeListThumbnailUrl(item.thumbnailUrl),
      }));
    }
    if (source === "scrap") {
      return scrappedNews.map((item) => ({
        id: item.newsId,
        newsId: item.newsId,
        title: item.title,
        place: item.place ?? "",
        dateRange: formatDate(item.createdAt),
        imageUrl: normalizeListThumbnailUrl(item.thumbnailUrl),
      }));
    }
    return myNews.map((item) => ({
      id: item.newsId,
      newsId: item.newsId,
      title: item.title,
      place: item.place ?? "",
      dateRange: formatDate(item.createdAt),
      imageUrl: normalizeListThumbnailUrl(item.thumbnailUrl),
    }));
  }, [source, scrappedNews, likedNews, myNews]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={contentContainerWhenEmpty(
          !loadingInitial && data.length === 0,
          styles.listContent,
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
        }
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
          loadingInitial ? (
            <ActivityIndicator size="small" color="#1F2A44" />
          ) : (
            <EmptyState message={emptyMessage} />
          )
        }
        onEndReachedThreshold={0.4}
        onEndReached={async () => {
          if (loadingInitial || loadingMore || !hasMore || !nextCursor) return;
          setLoadingMore(true);
          if (source === "scrap") {
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
          } else if (source === "like") {
            const res = await getMyLikedNews({
              limit: 20,
              cursor: nextCursor ?? undefined,
            });
            if (res) {
              setLikedNews((prev) => {
                const seen = new Set(prev.map((item) => item.likeId));
                const appended = res.items.filter((item) => !seen.has(item.likeId));
                return [...prev, ...appended];
              });
              setNextCursor(res.nextCursor);
              setHasMore(res.hasMore);
            }
          } else {
            const res = await getMyNewsPosts({
              limit: 20,
              cursor: nextCursor ?? undefined,
            });
            if (res) {
              setMyNews((prev) => [...prev, ...res.items]);
              setNextCursor(res.nextCursor);
              setHasMore(res.hasMore);
            }
          }
          setLoadingMore(false);
        }}
        ListFooterComponent={
          loadingMore ? (
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
