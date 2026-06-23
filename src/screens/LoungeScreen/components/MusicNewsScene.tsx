import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles";
import PerformanceNewsListCard from "./PerformanceNewsListCard";
import SectorTagSelectModal from "../../../components/modals/SectorTagSelectModal";
import { RootRoutes } from "../../../navigations/routes";
import { getNewsList } from "../../../lib/apis/news/newsApi";
import type { NewsListItem } from "../../../lib/apis/news/types";
import { GRAY, MAIN, WHITE } from "../../../color";

const GENRE_OPTIONS = [
  "클래식",
  "재즈",
  "뮤지컬",
  "국악",
  "대중음악",
  "오페라",
  "기타",
];

const REGION_OPTIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

type OpenOrder = "asc" | "desc";

function sortByStartedAt(items: NewsListItem[], order: OpenOrder) {
  return [...items].sort((a, b) => {
    const ta = new Date(a.startedAt).getTime();
    const tb = new Date(b.startedAt).getTime();
    if (!Number.isFinite(ta) || !Number.isFinite(tb)) return 0;
    return order === "asc" ? ta - tb : tb - ta;
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
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 12,
    height: 36,
    gap: 4,
  },
  filterChipActive: {
    borderColor: MAIN.DEFAULT,
    backgroundColor: MAIN.DEFAULT,
  },
  filterChipText: {
    color: MAIN.DEFAULT,
    fontSize: 14,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: WHITE,
  },
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
    marginLeft: 16 + 84 + 14,
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

const MusicNewsScene = () => {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openOrder, setOpenOrder] = useState<OpenOrder>("asc");
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [regionModalVisible, setRegionModalVisible] = useState(false);

  const searchKeyword = useMemo(() => {
    return selectedRegion[0] ?? selectedGenre[0] ?? undefined;
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
    [searchKeyword],
  );

  useEffect(() => {
    setNextCursor(null);
    void loadPage(null, false, "initial");
  }, [loadPage]);

  const displayedItems = useMemo(() => {
    const filtered = applyClientFilters(
      items,
      selectedGenre[0] ?? null,
      selectedRegion[0] ?? null,
    );
    return sortByStartedAt(filtered, openOrder);
  }, [items, openOrder, selectedGenre, selectedRegion]);

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

  const genreLabel =
    selectedGenre.length > 0 ? `장르 (${selectedGenre.length})` : "장르";
  const regionLabel =
    selectedRegion.length > 0 ? `지역 (${selectedRegion.length})` : "지역";

  return (
    <View style={styles.newsSceneContainer}>
      <View style={localStyles.filterRow}>
        <Pressable
          style={localStyles.filterChip}
          onPress={() =>
            setOpenOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          <MaterialCommunityIcons
            name="swap-vertical"
            size={16}
            color={MAIN.DEFAULT}
          />
          <Text style={localStyles.filterChipText}>오픈순</Text>
        </Pressable>

        <Pressable
          style={[
            localStyles.filterChip,
            selectedGenre.length > 0 && localStyles.filterChipActive,
          ]}
          onPress={() => setGenreModalVisible(true)}
        >
          <Text
            style={[
              localStyles.filterChipText,
              selectedGenre.length > 0 && localStyles.filterChipTextActive,
            ]}
          >
            {genreLabel}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={16}
            color={selectedGenre.length > 0 ? WHITE : MAIN.DEFAULT}
          />
        </Pressable>

        <Pressable
          style={[
            localStyles.filterChip,
            selectedRegion.length > 0 && localStyles.filterChipActive,
          ]}
          onPress={() => setRegionModalVisible(true)}
        >
          <Text
            style={[
              localStyles.filterChipText,
              selectedRegion.length > 0 && localStyles.filterChipTextActive,
            ]}
          >
            {regionLabel}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={16}
            color={selectedRegion.length > 0 ? WHITE : MAIN.DEFAULT}
          />
        </Pressable>
      </View>

      <SectorTagSelectModal
        visible={genreModalVisible}
        title="장르 선택"
        sections={[
          {
            title: "장르",
            options: GENRE_OPTIONS,
            selectedValues: selectedGenre,
            onToggle: (value) =>
              setSelectedGenre((prev) =>
                prev.includes(value) ? [] : [value],
              ),
          },
        ]}
        onComplete={() => setGenreModalVisible(false)}
      />

      <SectorTagSelectModal
        visible={regionModalVisible}
        title="지역 선택"
        sections={[
          {
            title: "지역",
            options: REGION_OPTIONS,
            selectedValues: selectedRegion,
            onToggle: (value) =>
              setSelectedRegion((prev) =>
                prev.includes(value) ? [] : [value],
              ),
          },
        ]}
        onComplete={() => setRegionModalVisible(false)}
      />

      {loading && items.length === 0 ? (
        <View style={localStyles.loaderContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : error ? (
        <View style={localStyles.loaderContainer}>
          <Text style={localStyles.errorText}>{error}</Text>
        </View>
      ) : displayedItems.length === 0 ? (
        <View style={localStyles.loaderContainer}>
          <Text style={localStyles.emptyText}>등록된 공연소식이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={displayedItems}
          keyExtractor={(item) => item.newsId}
          style={localStyles.flatList}
          contentContainerStyle={localStyles.listContent}
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
        />
      )}
    </View>
  );
};

export default MusicNewsScene;
