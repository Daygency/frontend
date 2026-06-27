import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MAIN, WHITE } from "../../../../color";
import {
  getHomeBannerFeed,
  type HomeBannerListItem,
} from "../../../../lib/apis/home/homeBannerApi";
import { isContentNew } from "../../../../lib/content/newBadge";
import NewBadge from "../../../../components/ui/NewBadge";
import { normalizeListThumbnailUrl } from "../../../../lib/media/listThumbnailUrl";
import { RootRoutes } from "../../../../navigations/routes";
import { getImageAverageColor } from "../../../../lib/media/getImageAverageColor";
import {
  CURATION_LOADING_BACKGROUND,
  type CurationThemeState,
} from "../../curationTheme";
import styles from "./styles";

const HORIZONTAL_GAP = 12;
const PAGE_SIZE = 20;

export type CurationFeedHandle = {
  scrollToTop: () => void;
  getScrollOffset: () => number;
};

type CurationFeedProps = {
  onCurationThemeChange?: (theme: CurationThemeState | null) => void;
};

function normalizeBanner(
  banner: HomeBannerListItem,
): HomeBannerListItem | null {
  const imageUrl = normalizeListThumbnailUrl(banner.imageUrl);
  if (!imageUrl) return null;
  return { ...banner, imageUrl };
}

const CurationFeed = forwardRef<CurationFeedHandle, CurationFeedProps>(
  function CurationFeed({ onCurationThemeChange }, ref) {
    const navigation = useNavigation<any>();
    const { width } = useWindowDimensions();
    const listRef = useRef<FlatList<HomeBannerListItem>>(null);
    const scrollOffsetRef = useRef(0);

    const contentWidth = width - HORIZONTAL_GAP * 2;
    const gridCardSize = (contentWidth - HORIZONTAL_GAP) / 2;
    const heroSize = contentWidth;

    const [featuredBanner, setFeaturedBanner] =
      useState<HomeBannerListItem | null>(null);
    const [gridBanners, setGridBanners] = useState<HomeBannerListItem[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        scrollToTop: () => {
          listRef.current?.scrollToOffset({ offset: 0, animated: true });
          scrollOffsetRef.current = 0;
        },
        getScrollOffset: () => scrollOffsetRef.current,
      }),
      [],
    );

    const applyFeaturedTheme = useCallback(
      async (banner: HomeBannerListItem | null) => {
        if (!onCurationThemeChange) return;

        if (!banner?.imageUrl) {
          onCurationThemeChange({
            loading: false,
            backgroundColor: CURATION_LOADING_BACKGROUND,
          });
          return;
        }

        onCurationThemeChange({
          loading: false,
          backgroundColor: "#1a1a1a",
        });

        try {
          const averageColor = await getImageAverageColor(banner.imageUrl);
          onCurationThemeChange({
            loading: false,
            backgroundColor: averageColor,
          });
        } catch {
          onCurationThemeChange({
            loading: false,
            backgroundColor: "#1a1a1a",
          });
        }
      },
      [onCurationThemeChange],
    );

    const loadPage = useCallback(
      async (
        cursor?: string | null,
        mode: "initial" | "refresh" | "more" = "initial",
      ) => {
        if (mode === "more") {
          if (!cursor) return;
          setLoadingMore(true);
        } else if (mode === "refresh") {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const res = await getHomeBannerFeed({
          cursor: cursor ?? undefined,
          limit: PAGE_SIZE,
        });

        if (mode === "more") setLoadingMore(false);
        else if (mode === "refresh") setRefreshing(false);
        else setLoading(false);

        if (!res) {
          if (mode !== "more") {
            setFeaturedBanner(null);
            setGridBanners([]);
            setNextCursor(null);
            setHasMore(false);
            void applyFeaturedTheme(null);
          }
          return;
        }

        setNextCursor(res.nextCursor);
        setHasMore(res.hasMore);

        const normalized = res.items
          .map(normalizeBanner)
          .filter((item): item is HomeBannerListItem => item != null);

        if (mode === "more") {
          setGridBanners((prev) => [...prev, ...normalized]);
          return;
        }

        const [first, ...rest] = normalized;
        setFeaturedBanner(first ?? null);
        setGridBanners(rest);
        void applyFeaturedTheme(first ?? null);
      },
      [applyFeaturedTheme],
    );

    useEffect(() => {
      void loadPage(null, "initial");
    }, [loadPage]);

    const onRefresh = useCallback(() => {
      if (refreshing || loadingMore) return;
      setNextCursor(null);
      void loadPage(null, "refresh");
    }, [loadPage, loadingMore, refreshing]);

    const onEndReached = useCallback(() => {
      if (loading || refreshing || loadingMore || !hasMore || !nextCursor) {
        return;
      }
      void loadPage(nextCursor, "more");
    }, [hasMore, loadPage, loading, loadingMore, nextCursor, refreshing]);

    const endReachReadyRef = useRef(false);

    const openDetail = useCallback(
      (bannerId: string) => {
        navigation.navigate(RootRoutes.HOME_BANNER_DETAIL, { bannerId });
      },
      [navigation],
    );

    const renderGridItem = useCallback(
      ({ item }: { item: HomeBannerListItem }) => {
        const showNewBadge = isContentNew(item.createdAt);

        return (
          <Pressable
            style={[styles.gridCard, { width: gridCardSize }]}
            onPress={() => openDetail(item.bannerId)}
          >
            <View
              style={[
                styles.imageWrap,
                { width: gridCardSize, height: gridCardSize },
              ]}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              {showNewBadge ? <NewBadge style={styles.newBadge} /> : null}
              {item.isCurrent === false ? (
                <View style={styles.pastBadge}>
                  <Text style={styles.pastBadgeText}>이전</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      },
      [gridCardSize, openDetail],
    );

    const listHeader = featuredBanner ? (
      <Pressable
        style={styles.heroWrap}
        onPress={() => openDetail(featuredBanner.bannerId)}
      >
        <View
          style={[
            styles.imageWrap,
            { width: heroSize, height: heroSize },
          ]}
        >
          <Image
            source={{ uri: featuredBanner.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {isContentNew(featuredBanner.createdAt) ? (
            <NewBadge style={styles.newBadge} />
          ) : null}
        </View>
      </Pressable>
    ) : null;

    const showInitialLoader = loading && !refreshing && !featuredBanner;

    const isEmpty =
      !loading && !refreshing && !featuredBanner && gridBanners.length === 0;

    return (
      <FlatList
        ref={listRef}
        data={showInitialLoader ? [] : gridBanners}
        keyExtractor={(item) => item.bannerId}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          (isEmpty || showInitialLoader) && styles.listContentEmpty,
          (showInitialLoader || isEmpty) && styles.listContentCentered,
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={WHITE}
            colors={[MAIN.DEFAULT]}
          />
        }
        onEndReachedThreshold={0.45}
        onMomentumScrollBegin={() => {
          endReachReadyRef.current = true;
        }}
        onEndReached={() => {
          if (!endReachReadyRef.current) return;
          onEndReached();
        }}
        ListHeaderComponent={showInitialLoader ? null : listHeader}
        ListEmptyComponent={
          showInitialLoader ? (
            <ActivityIndicator size="small" color="rgba(255,255,255,0.6)" />
          ) : isEmpty ? (
            <Text style={styles.emptyText}>큐레이션이 없습니다.</Text>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="rgba(255,255,255,0.6)" />
            </View>
          ) : null
        }
        renderItem={renderGridItem}
      />
    );
  },
);

export default CurationFeed;
