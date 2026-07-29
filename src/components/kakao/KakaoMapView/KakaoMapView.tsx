import { Alert, Linking, Platform, Pressable, Text, View } from "react-native";
import {
  getNativeMapLink,
  getNativeMapOpenLabel,
} from "../../../lib/kakao/location";
import styles from "./styles";

type KakaoMapViewProps = {
  place?: string;
};

export default function KakaoMapView({ place }: KakaoMapViewProps) {
  const placeLabel = place?.trim() ?? "";

  const openMap = async () => {
    const url = getNativeMapLink({
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

  if (!placeLabel) {
    return null;
  }

  const openLabel = getNativeMapOpenLabel(
    Platform.OS === "ios" ? "ios" : "android",
  );

  return (
    <View style={[styles.container, styles.addressOnly]}>
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
