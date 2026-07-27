import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { API_BASE } from "../../../lib/apis/api";
import {
  getNativeMapLink,
  getNativeMapOpenLabel,
  hasMapCoords,
} from "../../../lib/kakao/location";
import { MAIN } from "../../../color";
import styles from "./styles";

type KakaoMapViewProps = {
  latitude?: number | null;
  longitude?: number | null;
  place?: string;
  height?: number;
};

const MAX_STATIC_MAP_SIZE = 1024;
const STATIC_MAP_WIDTH = Math.min(
  MAX_STATIC_MAP_SIZE,
  Math.round(Dimensions.get("window").width),
);

export default function KakaoMapView({
  latitude,
  longitude,
  place,
  height = 180,
}: KakaoMapViewProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const coords = hasMapCoords({ latitude, longitude })
    ? { latitude: latitude!, longitude: longitude! }
    : null;
  const placeLabel = place?.trim() ?? "";

  const staticMapUrl = useMemo(() => {
    if (!coords) return null;
    const clampedHeight = Math.min(MAX_STATIC_MAP_SIZE, Math.round(height));
    const params = new URLSearchParams({
      latitude: String(coords.latitude),
      longitude: String(coords.longitude),
      width: String(STATIC_MAP_WIDTH),
      height: String(clampedHeight),
    });
    return `${API_BASE}/naver-map/static?${params.toString()}`;
  }, [coords, height]);

  const openMap = async () => {
    const url = getNativeMapLink({
      latitude,
      longitude,
      place: placeLabel,
      platform: Platform.OS === "ios" ? "ios" : "android",
    });
    if (!url) {
      Alert.alert("알림", "지도를 열 수 없습니다.");
      return;
    }
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("알림", "지도를 열 수 없습니다.");
    }
  };

  if (!coords && !placeLabel) {
    return null;
  }

  const openLabel = getNativeMapOpenLabel(
    Platform.OS === "ios" ? "ios" : "android",
  );

  if (!coords || !staticMapUrl || imageFailed) {
    return (
      <View style={[styles.container, styles.addressOnly, { minHeight: height }]}>
        <Text style={styles.addressText} numberOfLines={3}>
          {placeLabel}
        </Text>
        <Pressable
          style={styles.openBadgeInline}
          onPress={openMap}
          accessibilityRole="button"
          accessibilityLabel={openLabel}
        >
          <Text style={styles.openBadgeText}>{openLabel}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <Image
        source={{ uri: staticMapUrl }}
        style={{ width: "100%", height }}
        resizeMode="cover"
        onLoadEnd={() => setImageLoading(false)}
        onError={() => {
          setImageLoading(false);
          setImageFailed(true);
        }}
      />
      {imageLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={MAIN.DEFAULT} />
        </View>
      ) : null}
      <Pressable
        style={styles.openBadge}
        onPress={openMap}
        accessibilityRole="button"
        accessibilityLabel={openLabel}
      >
        <Text style={styles.openBadgeText}>{openLabel}</Text>
      </Pressable>
    </View>
  );
}
