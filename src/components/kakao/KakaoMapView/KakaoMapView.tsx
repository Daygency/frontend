import { useMemo } from "react";
import { Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getKakaoMapLink } from "../../../lib/kakao/location";
import { MAIN, WHITE } from "../../../color";
import styles from "./styles";

type KakaoMapViewProps = {
  latitude: number;
  longitude: number;
  height?: number;
};

const PREVIEW_DELTA = 0.008;

export default function KakaoMapView({
  latitude,
  longitude,
  height = 180,
}: KakaoMapViewProps) {
  const region = useMemo(
    () => ({
      latitude,
      longitude,
      latitudeDelta: PREVIEW_DELTA,
      longitudeDelta: PREVIEW_DELTA,
    }),
    [latitude, longitude],
  );

  const openMap = async () => {
    try {
      await Linking.openURL(getKakaoMapLink(latitude, longitude));
    } catch {
      Alert.alert("알림", "지도를 열 수 없습니다.");
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={StyleSheet.absoluteFill}
        region={region}
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
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
      <Pressable
        style={styles.openBadge}
        onPress={openMap}
        accessibilityRole="button"
        accessibilityLabel="카카오맵에서 보기"
      >
        <Text style={styles.openBadgeText}>카카오맵에서 보기</Text>
      </Pressable>
    </View>
  );
}
