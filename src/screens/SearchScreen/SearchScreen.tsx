import {
  View,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from "../../lib/recentSearchStorage";
import styles from "./styles";
import { GRAY, MAIN } from "../../color";

const SUGGESTED_TAGS = [
  "아티스트",
  "공연장정보",
  "대관소식",
  "기획자",
  "모집공고",
  "공연소식",
  "커뮤니티",
];

const SearchScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  const loadRecent = useCallback(async () => {
    const list = await getRecentSearches();
    setRecentSearches(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecent();
    }, [loadRecent])
  );

  const handleRemoveItem = async (term: string) => {
    await removeRecentSearch(term);
    loadRecent();
  };

  const handleClearAll = async () => {
    await clearRecentSearches();
    loadRecent();
  };

  const handleSuggestedTag = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleSubmitSearch = async () => {
    const query = [selectedTag, inputText.trim()].filter(Boolean).join(" ");
    if (query) {
      await addRecentSearch(query);
      loadRecent();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color="#000"
          />
        </Pressable>
        <View style={styles.searchBar}>
          {selectedTag !== null && (
            <Pressable
              style={styles.searchTagChip}
              onPress={() => setSelectedTag(null)}
            >
              <Text style={styles.searchTagChipText}>{selectedTag}</Text>
            </Pressable>
          )}
          <TextInput
            style={[
              styles.searchInput,
              selectedTag && styles.searchInputWithTag,
            ]}
            placeholder={
              selectedTag ? "추가 검색어 입력" : "검색어를 입력하세요"
            }
            placeholderTextColor={GRAY.DARK}
            value={inputText}
            onChangeText={setInputText}
            returnKeyType="search"
            onSubmitEditing={handleSubmitSearch}
          />
        </View>
      </View>

      <View style={styles.suggestedSection}>
        {SUGGESTED_TAGS.map((tag) => (
          <Pressable
            key={tag}
            style={styles.suggestedTag}
            onPress={() => handleSuggestedTag(tag)}
          >
            <Text style={styles.suggestedTagText}>{tag}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>최근 검색어</Text>
          {recentSearches.length > 0 && (
            <Pressable onPress={handleClearAll} hitSlop={8}>
              <Text style={styles.clearAllText}>전체 삭제</Text>
            </Pressable>
          )}
        </View>
        {recentSearches.length === 0 ? (
          <Text style={styles.emptyText}>최근 검색어가 없습니다</Text>
        ) : (
          <View style={styles.recentTagList}>
            {recentSearches.map((item) => (
              <View key={item} style={styles.recentTag}>
                <Pressable
                  style={styles.recentTagPress}
                  onPress={() => setInputText(item)}
                >
                  <Text style={styles.recentTagText}>{item}</Text>
                </Pressable>
                <Pressable
                  hitSlop={8}
                  onPress={() => handleRemoveItem(item)}
                  style={styles.recentTagRemove}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={16}
                    color={GRAY.DARK}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;
