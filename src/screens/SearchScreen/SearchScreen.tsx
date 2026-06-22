import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TabView } from "react-native-tab-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from "../../lib/recentSearchStorage";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import {
  CategoryList,
  SUGGESTED_SEARCH_TAGS,
  TAG_TO_SEARCH_CATEGORY,
  parseRecentSearchTerm,
} from "../../constants/categories";
import { renderSearchScene } from "./scenes/SearchTabScenes";
import styles from "./styles";
import { GRAY } from "../../color";

const SearchScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const initialTag = (route.params as { initialTag?: string } | undefined)
    ?.initialTag;

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const loadRecent = useCallback(async () => {
    const list = await getRecentSearches();
    setRecentSearches(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecent();
      if (initialTag != null && TAG_TO_SEARCH_CATEGORY[initialTag]) {
        setSelectedTag(initialTag);
      }
    }, [loadRecent, initialTag]),
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

  const runSearch = useCallback(
    async (opts?: { tag?: string | null; query?: string }) => {
      const tag = opts?.tag !== undefined ? opts.tag : selectedTag;
      const query = (opts?.query !== undefined ? opts.query : inputText).trim();
      if (!tag && !query) return;

      const label = [tag, query].filter(Boolean).join(" ");
      if (label) {
        await addRecentSearch(label);
        loadRecent();
      }

      setSubmittedQuery(query);
      setTabIndex(0);
      setIsShowingResults(true);
    },
    [selectedTag, inputText, loadRecent],
  );

  const handleSubmitSearch = () => {
    void runSearch();
  };

  const handleResetSearch = () => {
    setIsShowingResults(false);
    setSubmittedQuery("");
  };

  const taggedRoutes = useMemo(() => {
    if (!selectedTag) return [];
    const mapped = TAG_TO_SEARCH_CATEGORY[selectedTag];
    if (!mapped) return [];
    return [{ key: mapped, title: mapped }];
  }, [selectedTag]);

  const unifiedRoutes = CategoryList.map((category) => ({
    key: category,
    title: category,
  }));

  const routes = selectedTag ? taggedRoutes : unifiedRoutes;
  const currentIndex = Math.min(tabIndex, Math.max(routes.length - 1, 0));

  const renderScene = ({ route: sceneRoute }: { route: { key: string } }) =>
    renderSearchScene(sceneRoute.key, submittedQuery);

  const handleRecentPress = (term: string) => {
    const parsed = parseRecentSearchTerm(term);
    setSelectedTag(parsed.tag);
    setInputText(parsed.query);
    void runSearch({ tag: parsed.tag, query: parsed.query });
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
              selectedTag ? "추가 검색어 입력" : "모집공고, 공연소식, 아티스트…"
            }
            placeholderTextColor={GRAY.DARK}
            value={inputText}
            onChangeText={setInputText}
            returnKeyType="search"
            onSubmitEditing={handleSubmitSearch}
          />
        </View>
        {isShowingResults && (
          <Pressable
            onPress={handleResetSearch}
            hitSlop={10}
            style={styles.clearButton}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={GRAY.DARK}
            />
          </Pressable>
        )}
      </View>

      {isShowingResults ? (
        routes.length > 0 ? (
          routes.length === 1 ? (
            <View style={styles.resultsContent}>
              {renderScene({ route: routes[0] })}
            </View>
          ) : (
            <TabView
              navigationState={{ index: currentIndex, routes }}
              renderScene={renderScene}
              onIndexChange={setTabIndex}
              renderTabBar={(props) => (
                <CategoryTabBar
                  {...props}
                  evenlyDistributed={routes.length >= 4}
                />
              )}
              initialLayout={{ width: layout.width }}
              style={styles.tabView}
            />
          )
        ) : (
          <View style={styles.resultsContent}>
            <Text style={styles.emptyText}>검색 결과를 표시할 수 없습니다.</Text>
          </View>
        )
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestedScroll}
            contentContainerStyle={styles.suggestedSection}
          >
            {SUGGESTED_SEARCH_TAGS.map((tag) => (
              <Pressable
                key={tag}
                style={[
                  styles.suggestedTag,
                  selectedTag === tag && styles.suggestedTagActive,
                ]}
                onPress={() => handleSuggestedTag(tag)}
              >
                <Text
                  style={[
                    styles.suggestedTagText,
                    selectedTag === tag && styles.suggestedTagTextActive,
                  ]}
                >
                  {tag}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
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
                      onPress={() => handleRecentPress(item)}
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
        </>
      )}
    </View>
  );
};

export default SearchScreen;
