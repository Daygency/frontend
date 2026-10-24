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
  searchJusoAddress,
  type JusoAddressItem,
} from "../../../lib/apis/juso/jusoApi";
import styles from "./styles";

export type JusoAddressValue = {
  address: string;
};

type JusoAddressFieldProps = {
  value: JusoAddressValue;
  onChange: (value: JusoAddressValue) => void;
  placeholder?: string;
  hasError?: boolean;
};

export default function JusoAddressField({
  value,
  onChange,
  placeholder = "주소를 입력하세요",
  hasError,
}: JusoAddressFieldProps) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<JusoAddressItem[]>([]);
  const [focused, setFocused] = useState(false);

  const handleChangeText = useCallback(
    (text: string) => {
      setResults([]);
      onChange({ address: text });
    },
    [onChange],
  );

  const handleSearch = useCallback(async () => {
    const query = value.address.trim();
    if (!query) {
      Alert.alert("알림", "검색할 주소를 입력해주세요.");
      return;
    }
    setSearching(true);
    const res = await searchJusoAddress(query);
    setSearching(false);
    if (!res.ok) {
      Alert.alert("주소 검색", res.message);
      return;
    }
    setResults(res.items);
    if (res.items.length === 0) {
      Alert.alert("주소 검색", "검색 결과가 없습니다.");
    }
  }, [value.address]);

  const handleSelect = useCallback(
    (item: JusoAddressItem) => {
      setResults([]);
      onChange({ address: item.roadAddr });
    },
    [onChange],
  );

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.fieldRow,
          focused && styles.fieldFocused,
          hasError && styles.fieldError,
        ]}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={GRAY.MEDIUM_100}
          style={styles.input}
          value={value.address}
          onChangeText={handleChangeText}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={MAIN.DEFAULT}
          cursorColor={MAIN.DEFAULT}
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
          {results.map((item, index) => (
            <Pressable
              key={`${item.roadAddr}-${index}`}
              style={({ pressed }) => [
                styles.resultRow,
                pressed && styles.resultRowPressed,
              ]}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.resultAddress} numberOfLines={2}>
                {item.roadAddr}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
