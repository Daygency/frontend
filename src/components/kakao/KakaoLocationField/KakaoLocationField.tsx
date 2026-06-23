import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";
import {
  searchKakaoPlaces,
  type KakaoPlaceItem,
} from "../../../lib/apis/kakao/kakaoApi";
import {
  hasMapCoords,
  type KakaoLocationValue,
} from "../../../lib/kakao/location";
import KakaoMapView from "../KakaoMapView/KakaoMapView";
import styles from "./styles";

type KakaoLocationFieldProps = {
  value: KakaoLocationValue;
  onChange: (value: KakaoLocationValue) => void;
  placeholder?: string;
  hasError?: boolean;
};

export default function KakaoLocationField({
  value,
  onChange,
  placeholder = "장소를 입력하세요",
  hasError,
}: KakaoLocationFieldProps) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<KakaoPlaceItem[]>([]);

  const handleChangeText = useCallback(
    (text: string) => {
      setResults([]);
      onChange({
        address: text,
        latitude: null,
        longitude: null,
      });
    },
    [onChange],
  );

  const handleSearch = useCallback(async () => {
    const query = value.address.trim();
    if (!query) {
      Alert.alert("알림", "검색할 장소를 입력해주세요.");
      return;
    }
    setSearching(true);
    const res = await searchKakaoPlaces(query);
    setSearching(false);
    if (!res.ok) {
      Alert.alert("장소 검색", res.message);
      return;
    }
    setResults(res.items);
    if (res.items.length === 0) {
      Alert.alert("장소 검색", "검색 결과가 없습니다.");
    }
  }, [value.address]);

  const handleSelect = useCallback(
    (item: KakaoPlaceItem) => {
      setResults([]);
      onChange({
        address: item.placeName,
        latitude: item.latitude,
        longitude: item.longitude,
      });
    },
    [onChange],
  );

  return (
    <View style={styles.wrap}>
      <View style={[styles.fieldRow, hasError && styles.fieldError]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={GRAY.MEDIUM_100}
          style={styles.input}
          value={value.address}
          onChangeText={handleChangeText}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          multiline={false}
          numberOfLines={1}
          {...Platform.select({
            android: { includeFontPadding: false },
            web: { cursor: "text" },
          })}
        />
        <Pressable
          style={({ pressed }) => [
            styles.searchButton,
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleSearch}
          disabled={searching}
        >
          {searching ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <Text style={styles.searchButtonText}>검색</Text>
          )}
        </Pressable>
      </View>

      {results.length > 0 ? (
        <View style={styles.results}>
          {results.map((item) => (
            <Pressable
              key={`${item.placeId}-${item.latitude}-${item.longitude}`}
              style={({ pressed }) => [
                styles.resultRow,
                pressed && styles.resultRowPressed,
              ]}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.resultTitle} numberOfLines={1}>
                {item.placeName}
              </Text>
              <Text style={styles.resultAddress} numberOfLines={2}>
                {item.address}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {hasMapCoords(value) ? (
        <View style={styles.mapBlock}>
          <Text style={styles.mapLabel}>지도 미리보기</Text>
          <KakaoMapView
            latitude={value.latitude}
            longitude={value.longitude}
          />
        </View>
      ) : null}
    </View>
  );
}

export type { KakaoLocationValue };
