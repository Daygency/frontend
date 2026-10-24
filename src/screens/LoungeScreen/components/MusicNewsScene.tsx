import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../styles";
import PerformanceNewsListCard from "./PerformanceNewsListCard";
import MusicNewsListSkeleton from "./MusicNewsListSkeleton";
import { RootRoutes } from "../../../navigations/routes";
import { getNewsList } from "../../../lib/apis/news/newsApi";
import type { NewsListItem } from "../../../lib/apis/news/types";
import { GRAY } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import type { PerformanceNewsSortMode } from "./performanceNewsFilterOptions";
import { useLoungeScroll } from "../LoungeScrollContext";

const POSTER_WIDTH = 96;

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

const localStyles = themedStyles(() => ({
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
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
}));

const renderSeparator = () => <View style={localStyles.separator} />;

const keyExtractor = (item: NewsListItem) => item.newsId;

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
  const { listTopInset, newsScrollHandler, setNewsListRef } = useLoungeScroll();
  const [items, setItems] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingMoreRef = useRef(false);

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
      if (mode === "more") {
        if (isFetchingMoreRef.current) return;
        isFetchingMoreRef.current = true;
        setLoadingMore(true);
      } else if (mode === "refresh") setRefreshing(true);
      else setLoading(true);

      const res = await getNewsList({
        cursor: cursor ?? undefined,
        limit: 8,
        q: searchKeyword,
        sort: sortMode,
      });

      if (mode === "more") {
        isFetchingMoreRef.current = false;
        setLoadingMore(false);
      } else if (mode === "refresh") setRefreshing(false);
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

  useFocusEffect(
    useCallback(() => {
      setNextCursor(null);
      void loadPage(null, false, "initial");
    }, [loadPage]),
  );

  const displayedItems = useMemo(
    () => applyClientFilters(items, selectedGenre, selectedRegion),
    [items, selectedGenre, selectedRegion],
  );

  const refresh = useCallback(() => {
    if (refreshing || loadingMore) return;
    setNextCursor(null);
    void loadPage(null, false, "refresh");
  }, [loadPage, refreshing, loadingMore]);

  const handleEndReached = useCallback(() => {
    if (
      !hasMore ||
      !nextCursor ||
      loadingMore ||
      loading ||
      refreshing ||
      isFetchingMoreRef.current
    )
      return;
    void loadPage(nextCursor, true, "more");
  }, [hasMore, nextCursor, loadingMore, loading, refreshing, loadPage]);

  const handleItemPress = useCallback(
    (newsId: string) => {
      navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, { newsId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: NewsListItem }) => (
      <PerformanceNewsListCard item={item} onPress={handleItemPress} />
    ),
    [handleItemPress],
  );

  return (
    <View style={styles.newsSceneContainer}>
      <AnimatedFlatList
        ref={setNewsListRef}
        data={displayedItems}
        keyExtractor={keyExtractor}
        style={localStyles.flatList}
        contentContainerStyle={[
          localStyles.listContent,
          { paddingTop: listTopInset },
        ]}
        onScroll={newsScrollHandler}
        scrollEventThrottle={16}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.35}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        ListFooterComponent={
          loadingMore ? (
            <View style={localStyles.footerLoader}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          items.length === 0 && (loading || error) ? (
            <MusicNewsListSkeleton />
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
