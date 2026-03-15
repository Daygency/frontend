import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import SelectableTag from "../../../components/SelectableTag/SelectableTag";
import EventNewsCard from "../../../components/EventNewsCard/EventNewsCard";
import { RootRoutes } from "../../../navigations/routes";
import { getNewsList } from "../../../lib/apis/news/newsApi";
import type { NewsListItem } from "../../../lib/apis/news/types";

function formatStartedAt(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${day} ${h}:${min}`;
  } catch {
    return iso;
  }
}

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
    async (cursor?: string | null, append = false) => {
      if (append && !cursor) return;
      if (append) setLoadingMore(true);
      else if (!cursor) setLoading(true);

      const res = await getNewsList({
        cursor: cursor ?? undefined,
        limit: 20,
      });

      if (append) setLoadingMore(false);
      else setLoading(false);
      setRefreshing(false);

      if (!res) {
        setError("목록을 불러오지 못했습니다.");
        return;
      }
      setError(null);
      setItems((prev) => (append ? [...prev, ...res.items] : res.items));
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    },
    []
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    loadPage(null, false);
  }, [loadPage]);

  useEffect(() => {
    loadPage(null, false);
  }, []);

  const handleEndReached = useCallback(() => {
    if (!loadingMore && hasMore && nextCursor) {
      loadPage(nextCursor, true);
    }
  }, [loadPage, loadingMore, hasMore, nextCursor]);

  const renderItem = ({ item }: { item: NewsListItem }) => (
    <EventNewsCard
      title={item.title}
      place={item.place}
      dateRange={formatStartedAt(item.startedAt)}
      containerStyle={localStyles.card}
      onPress={() =>
        navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, { newsId: item.newsId })
      }
    />
  );

  return (
    <View style={styles.newsSceneContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortFilterContainer}
        nestedScrollEnabled
        directionalLockEnabled
        scrollEventThrottle={16}
        bounces={false}
      >
        <SelectableTag label="최신순" selected />
      </ScrollView>
      {loading ? (
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
          columnWrapperStyle={localStyles.columnWrapper}
          contentContainerStyle={localStyles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
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

const localStyles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: "48%",
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

export default MusicNewsScene;

