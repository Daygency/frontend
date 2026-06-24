import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  useWindowDimensions,
} from "react-native";
import ViewerPressableImage from "../../components/media/ViewerPressableImage";
import { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MAIN, WHITE } from "../../color";
import { getHomeBannerDetail } from "../../lib/apis/home/homeBannerApi";
import { formatContentDate, isContentNew } from "../../lib/content/newBadge";
import NewBadge from "../../components/ui/NewBadge";
import { normalizeListThumbnailUrl } from "../../lib/media/listThumbnailUrl";
import { RootRoutes } from "../../navigations/routes";
import styles from "./styles";

type RouteParams = {
  [RootRoutes.HOME_BANNER_DETAIL]: { bannerId: string };
};

const HomeBannerDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, typeof RootRoutes.HOME_BANNER_DETAIL>>();
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bannerId = route.params?.bannerId?.trim() ?? "";
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!bannerId) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const data = await getHomeBannerDetail(bannerId);
      setTitle(data?.title?.trim() ?? "");
      setCreatedAt(data?.createdAt ?? "");
      if (data?.imageUrls?.length) {
        setImageUrls(
          data.imageUrls
            .map((url) => normalizeListThumbnailUrl(url))
            .filter((url): url is string => Boolean(url)),
        );
      } else {
        setImageUrls([]);
      }
      setLoading(false);
    })();
  }, [bannerId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={MAIN.DEFAULT} />
      </View>
    );
  }

  const formattedDate = formatContentDate(createdAt);
  const showNewBadge = isContentNew(createdAt);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: WHITE }}
      contentContainerStyle={{ paddingBottom: bottom + 24 }}
    >
      {title || formattedDate ? (
        <View style={styles.header}>
          {title ? (
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              {showNewBadge ? <NewBadge /> : null}
            </View>
          ) : null}
          {formattedDate ? (
            <Text style={styles.timestamp}>{formattedDate}</Text>
          ) : null}
        </View>
      ) : null}
      {imageUrls.map((url, index) => (
        <ViewerPressableImage
          key={`${url}-${index}`}
          urls={imageUrls}
          imageIndex={index}
          source={{ uri: url }}
          style={[styles.image, { width, aspectRatio: 1 }]}
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
};

export default HomeBannerDetailScreen;
