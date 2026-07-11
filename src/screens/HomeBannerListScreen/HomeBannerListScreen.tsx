import { useCallback, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GRAY, MAIN, WHITE } from "../../color";
import { getHomeBanners } from "../../lib/apis/home/homeBannerApi";
import type { HomeBannerListItem } from "../../lib/apis/home/homeBannerApi";
import { isContentNew } from "../../lib/content/newBadge";
import NewBadge from "../../components/ui/NewBadge";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import { normalizeListThumbnailUrl } from "../../lib/media/listThumbnailUrl";
import { RootRoutes } from "../../navigations/routes";
import styles from "./styles";

type RootStackParamList = {
  [RootRoutes.HOME_BANNER_LIST]: undefined;
  [RootRoutes.HOME_BANNER_DETAIL]: { bannerId: string };
};

const HORIZONTAL_PADDING = 20;
const CARD_GAP = 12;
const PAGE_LIMIT = 8;

function sanitizeBanners(list: HomeBannerListItem[]): HomeBannerListItem[] {
  return list
    .map((banner) => {
      const imageUrl = normalizeListThumbnailUrl(banner.imageUrl);
      if (!imageUrl) return null;
      return { ...banner, imageUrl };
    })
    .filter((item): item is HomeBannerListItem => item != null);
}

const HomeBannerListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const cardWidth = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
  const [banners, setBanners] = useState<HomeBannerListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    const res = await getHomeBanners({ limit: PAGE_LIMIT });
    setBanners(sanitizeBanners(res.items));
    setNextCursor(res.nextCursor);
    setHasMore(res.hasMore);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadBanners();
    }, [loadBanners]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBanners();
    setRefreshing(false);
  }, [loadBanners]);

  const onEndReached = useCallback(async () => {
    if (!hasMore || !nextCursor || loadingMore || loading) return;
    setLoadingMore(true);
    const res = await getHomeBanners({ cursor: nextCursor, limit: PAGE_LIMIT });
    setBanners((prev) => [...prev, ...sanitizeBanners(res.items)]);
    setNextCursor(res.nextCursor);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  }, [hasMore, nextCursor, loadingMore, loading]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <FlatList
      data={banners}
      keyExtractor={(item) => item.bannerId}
      numColumns={2}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
      onEndReached={() => void onEndReached()}
      onEndReachedThreshold={0.35}
      contentContainerStyle={contentContainerWhenEmpty(
        banners.length === 0,
        [styles.listContent, { paddingBottom: bottom + 24 }],
      )}
      ListEmptyComponent={
        <EmptyState message="매거진이 없습니다." />
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={{ paddingVertical: 16 }}>
            <ActivityIndicator color={MAIN.DEFAULT} />
          </View>
        ) : null
      }
      renderItem={({ item }) => {
        const showNewBadge = isContentNew(item.createdAt);

        return (
          <Pressable
            style={[styles.card, { width: cardWidth }]}
            onPress={() =>
              navigation.navigate(RootRoutes.HOME_BANNER_DETAIL, {
                bannerId: item.bannerId,
              })
            }
          >
            <View
              style={[styles.imageWrap, { width: cardWidth, height: cardWidth }]}
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
            {item.title ? (
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
            ) : null}
          </Pressable>
        );
      }}
    />
  );
};

export default HomeBannerListScreen;
