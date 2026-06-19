import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import EventNewsCard from "../../../components/EventNewsCard/EventNewsCard";
import { RootRoutes } from "../../../navigations/routes";
import { getNewsList } from "../../../lib/apis/news/newsApi";
import type { NewsListItem } from "../../../lib/apis/news/types";
import { pickNewsListThumbnailUrl } from "../../../lib/media/listThumbnailUrl";

function formatRelativeTime(iso?: string): string {
  if (!iso) return "";
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return "";

  const diffMs = Date.now() - target.getTime();
  if (diffMs < 0) return "방금전";

  const hourMs = 1000 * 60 * 60;
  const dayMs = hourMs * 24;
  const monthMs = dayMs * 30;
  const yearMs = dayMs * 365;

  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.floor(diffMs / hourMs));
    return `${hours}시간전`;
  }
  if (diffMs < monthMs) {
    const days = Math.floor(diffMs / dayMs);
    return `${days}일전`;
  }
  if (diffMs < yearMs) {
    const months = Math.floor(diffMs / monthMs);
    return `${months}달전`;
  }
  const years = Math.floor(diffMs / yearMs);
  return `${years}년전`;
}

const localStyles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginTop: 0,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 24,
    flexGrow: 1,
    justifyContent: "flex-start",
    alignSelf: "stretch",
  },
  columnWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    maxWidth: "48%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  errorText: {
    fontSize: 14,
    color: "#999",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});

const MusicNewsScene = () => {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (
      cursor?: string | null,
      append = false,
      mode: "initial" | "refresh" | "more" = "initial",
    ) => {
      if (append && !cursor) return;
      if (mode === "more") setLoadingMore(true);
      else if (mode === "refresh") setRefreshing(true);
      else setLoading(true);

      const res = await getNewsList({
        cursor: cursor ?? undefined,
        limit: 20,
      });

      if (mode === "more") setLoadingMore(false);
      else if (mode === "refresh") setRefreshing(false);
      else setLoading(false);

      if (!res) {
        if (mode !== "more") {
          setError("목록을 불러오지 못했습니다.");
        }
        return;
      }
      setError(null);
      setItems((prev) => (append ? [...prev, ...res.items] : res.items));
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    },
    [],
  );

  const refresh = useCallback(() => {
    if (refreshing || loadingMore) return;
    setNextCursor(null);
    void loadPage(null, false, "refresh");
  }, [loadPage, refreshing, loadingMore]);

  useEffect(() => {
    void loadPage(null, false, "initial");
  }, [loadPage]);

  const endReachReadyRef = useRef(false);

  const handleEndReached = useCallback(() => {
    if (!endReachReadyRef.current) return;
    if (loadingMore || refreshing || loading || !hasMore || !nextCursor) return;
    void loadPage(nextCursor, true, "more");
  }, [loadPage, loadingMore, refreshing, loading, hasMore, nextCursor]);

  const renderItem = ({ item }: { item: NewsListItem }) => (
    <EventNewsCard
      title={item.title}
      place={item.place}
      dateRange=""
      imageUrl={pickNewsListThumbnailUrl(item)}
      likeCount={item.likeCount ?? 0}
      commentCount={item.commentCount ?? 0}
      viewCount={item.viewCount ?? 0}
      relativeTimeText={formatRelativeTime(item.startedAt)}
      showPlace={false}
      showDate={false}
      containerStyle={localStyles.card}
      onPress={() =>
        navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, { newsId: item.newsId })
      }
    />
  );

  return (
    <View style={styles.newsSceneContainer}>
      {loading && items.length === 0 ? (
        <View style={localStyles.loaderContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : error ? (
        <View style={localStyles.loaderContainer}>
          <Text style={localStyles.errorText}>{error}</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={localStyles.loaderContainer}>
          <Text style={localStyles.emptyText}>등록된 공연소식이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.newsId}
          numColumns={2}
          style={localStyles.flatList}
          columnWrapperStyle={localStyles.columnWrapper}
          contentContainerStyle={localStyles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          onMomentumScrollBegin={() => {
            endReachReadyRef.current = true;
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={localStyles.footerLoader}>
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default MusicNewsScene;

