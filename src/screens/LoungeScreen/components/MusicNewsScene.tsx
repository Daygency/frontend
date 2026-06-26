import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import PerformanceNewsListCard from "./PerformanceNewsListCard";
import { RootRoutes } from "../../../navigations/routes";
import { getNewsList } from "../../../lib/apis/news/newsApi";
import type { NewsListItem } from "../../../lib/apis/news/types";
import { GRAY } from "../../../color";
import type { PerformanceNewsSortMode } from "./performanceNewsFilterOptions";
import { useLoungeScroll } from "../LoungeScrollContext";

const POSTER_WIDTH = 112;

function sortNewsItems(items: NewsListItem[], mode: PerformanceNewsSortMode) {
  return [...items].sort((a, b) => {
    if (mode === "created") {
      const ta = new Date(a.createdAt ?? 0).getTime();
      const tb = new Date(b.createdAt ?? 0).getTime();
      if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) {
        return tb - ta;
      }
      return String(b.newsId).localeCompare(String(b.newsId));
    }

    const ta = new Date(a.startedAt).getTime();
    const tb = new Date(b.startedAt).getTime();
    if (!Number.isFinite(ta) || !Number.isFinite(tb)) return 0;
    return ta - tb;
  });
}

function applyClientFilters(
  items: NewsListItem[],
  genre: string | null,
  region: string | null,
) {
  return items.filter((item) => {
    if (genre && !item.title.includes(genre)) return false;
    if (region && !item.place.includes(region)) return false;
    return true;
  });
}

const localStyles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: GRAY.MEDIUM,
    marginLeft: 16 + POSTER_WIDTH + 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  errorText: {
    fontSize: 14,
    color: GRAY.DARK,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});

type MusicNewsSceneProps = {
  sortMode: PerformanceNewsSortMode;
  selectedGenre: string | null;
  selectedRegion: string | null;
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<NewsListItem>);

const MusicNewsScene = ({
  sortMode,
  selectedGenre,
  selectedRegion,
}: MusicNewsSceneProps) => {
  const navigation = useNavigation<any>();
  const { listTopInset, newsScrollHandler } = useLoungeScroll();
  const [items, setItems] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchKeyword = useMemo(() => {
    return selectedRegion ?? selectedGenre ?? undefined;
  }, [selectedGenre, selectedRegion]);

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
        q: searchKeyword,
        sort: sortMode,
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
    [searchKeyword, sortMode],
  );

  useEffect(() => {
    setNextCursor(null);
    void loadPage(null, false, "initial");
  }, [loadPage]);

  const displayedItems = useMemo(() => {
    const filtered = applyClientFilters(items, selectedGenre, selectedRegion);
    if (sortMode === "imminent") return filtered;
    return sortNewsItems(filtered, sortMode);
  }, [items, sortMode, selectedGenre, selectedRegion]);

  const refresh = useCallback(() => {
    if (refreshing || loadingMore) return;
    setNextCursor(null);
    void loadPage(null, false, "refresh");
  }, [loadPage, refreshing, loadingMore]);

  const endReachReadyRef = useRef(false);

  const handleEndReached = useCallback(() => {
    if (!endReachReadyRef.current) return;
    if (loadingMore || refreshing || loading || !hasMore || !nextCursor) return;
    void loadPage(nextCursor, true, "more");
  }, [loadPage, loadingMore, refreshing, loading, hasMore, nextCursor]);

  return (
    <View style={styles.newsSceneContainer}>
      <AnimatedFlatList
        data={displayedItems}
        keyExtractor={(item) => item.newsId}
        style={localStyles.flatList}
        contentContainerStyle={[
          localStyles.listContent,
          { paddingTop: listTopInset },
        ]}
        onScroll={newsScrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <PerformanceNewsListCard
            item={item}
            onPress={() =>
              navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, {
                newsId: item.newsId,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={localStyles.separator} />}
        showsVerticalScrollIndicator={false}
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
        ListEmptyComponent={
          loading && items.length === 0 ? (
            <View style={localStyles.loaderContainer}>
              <ActivityIndicator size="small" />
            </View>
          ) : error ? (
            <View style={localStyles.loaderContainer}>
              <Text style={localStyles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={localStyles.loaderContainer}>
              <Text style={localStyles.emptyText}>등록된 공연소식이 없습니다.</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default MusicNewsScene;
