import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
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
import NewBadge from "../../components/NewBadge/NewBadge";
import { normalizeListThumbnailUrl } from "../../lib/media/listThumbnailUrl";
import { RootRoutes } from "../../navigations/routes";
import styles from "./styles";

type RootStackParamList = {
  [RootRoutes.HOME_BANNER_LIST]: undefined;
  [RootRoutes.HOME_BANNER_DETAIL]: { bannerId: string };
};

const HORIZONTAL_PADDING = 20;
const CARD_GAP = 12;

const HomeBannerListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const cardWidth = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
  const [banners, setBanners] = useState<HomeBannerListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    const list = await getHomeBanners();
    setBanners(
      list
        .map((banner) => {
          const imageUrl = normalizeListThumbnailUrl(banner.imageUrl);
          if (!imageUrl) return null;
          return { ...banner, imageUrl };
        })
        .filter((item): item is HomeBannerListItem => item != null),
    );
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadBanners();
    }, [loadBanners]),
  );

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
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: bottom + 24 },
      ]}
      ListEmptyComponent={
        <Text style={styles.emptyText}>큐레이션이 없습니다.</Text>
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
