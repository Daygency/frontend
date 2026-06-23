import { useMemo } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  getNativeMapLink,
  getNativeMapOpenLabel,
  hasMapCoords,
} from "../../../lib/kakao/location";
import { GRAY, MAIN } from "../../../color";
import styles from "./styles";

type KakaoMapViewProps = {
  latitude?: number | null;
  longitude?: number | null;
  place?: string;
  height?: number;
};

const PREVIEW_DELTA = 0.008;

export default function KakaoMapView({
  latitude,
  longitude,
  place,
  height = 180,
}: KakaoMapViewProps) {
  const coords = hasMapCoords({ latitude, longitude })
    ? { latitude: latitude!, longitude: longitude! }
    : null;
  const placeLabel = place?.trim() ?? "";

  const region = useMemo(() => {
    if (!coords) return null;
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: PREVIEW_DELTA,
      longitudeDelta: PREVIEW_DELTA,
    };
  }, [coords]);

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

  if (!coords) {
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
      <MapView
        style={StyleSheet.absoluteFill}
        region={region!}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        {...Platform.select({
          android: { liteMode: true },
          default: {},
        })}
      >
        <Marker
          coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
          title={placeLabel || undefined}
        />
      </MapView>
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
