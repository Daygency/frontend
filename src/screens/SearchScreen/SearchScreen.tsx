import {
  View,
  Text,
  Pressable,
  TextInput,
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
import AllContentScene from "../../components/AllContentScene/AllContentScene";
import ArtistScene from "../MainHomeScreen/scenes/ArtistScene";
import VenueScene from "../MainHomeScreen/scenes/VenueScene";
import AgencyScene from "../MainHomeScreen/scenes/AgencyScene";
import AnnouncementScreen from "../AnnouncementScreen/AnnouncementScreen";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import { CategoryList } from "../../constants/categories";
import styles from "./styles";
import { GRAY } from "../../color";

const SUGGESTED_TAGS = [
  "아티스트",
  "공연장정보",
  "대관소식",
  "기획자",
  "모집공고",
  "공연소식",
  "커뮤니티",
];

const TAG_TO_CATEGORY: Record<
  string,
  { key: string; title: string; initialTab?: "info" | "news" }
> = {
  아티스트: { key: "아티스트", title: "아티스트" },
  공연장정보: { key: "공연장", title: "공연장" },
  대관소식: { key: "공연장", title: "공연장", initialTab: "news" },
  기획자: { key: "기획사", title: "기획사" },
  모집공고: { key: "모집공고", title: "모집공고" },
  채용: { key: "모집공고", title: "모집공고" },
  공연소식: { key: "전체", title: "전체" },
  커뮤니티: { key: "전체", title: "전체" },
};

const SearchScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const initialTag = (route.params as { initialTag?: string } | undefined)?.initialTag;

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const loadRecent = useCallback(async () => {
    const list = await getRecentSearches();
    setRecentSearches(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecent();
      if (initialTag != null) {
        setSelectedTag(initialTag);
      }
    }, [loadRecent, initialTag])
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
    const hasSearch = selectedTag || inputText.trim();
    if (!hasSearch) return;

    const query = [selectedTag, inputText.trim()].filter(Boolean).join(" ");
    if (query) {
      await addRecentSearch(query);
      loadRecent();
    }
    setIsShowingResults(true);
  };

  const handleResetSearch = () => {
    setIsShowingResults(false);
  };

  const selectedTags = selectedTag ? [selectedTag] : [];
  const isUnifiedSearch = selectedTags.length === 0;

  const unifiedRoutes = CategoryList.map((category) => ({
    key: category,
    title: category,
  }));

  const taggedRoutes = useMemo(() => {
    const seen = new Set<string>();
    const routes: {
      key: string;
      title: string;
      initialTab?: "info" | "news";
    }[] = [];
    selectedTags.forEach((tag) => {
      const mapped = TAG_TO_CATEGORY[tag];
      if (mapped && !seen.has(mapped.key)) {
        seen.add(mapped.key);
        routes.push(mapped);
      }
    });
    return routes;
  }, [selectedTags]);

  const routes = isUnifiedSearch ? unifiedRoutes : taggedRoutes;
  const currentIndex = Math.min(tabIndex, routes.length - 1);

  const renderScene = ({
    route: sceneRoute,
  }: {
    route: { key: string; initialTab?: "info" | "news" };
  }) => {
    switch (sceneRoute.key) {
      case "전체":
        return <AllContentScene />;
      case "아티스트":
        return <ArtistScene />;
      case "공연장":
        return <VenueScene initialTab={sceneRoute.initialTab ?? "info"} />;
      case "기획사":
        return <AgencyScene />;
      case "모집공고":
        return <AnnouncementScreen hideTopBar />;
      default:
        return null;
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
              renderScene={({ route: r }) => renderScene({ route: { ...r } })}
              onIndexChange={setTabIndex}
              renderTabBar={(props) => <CategoryTabBar {...props} />}
              initialLayout={{ width: layout.width }}
              style={styles.tabView}
            />
          )
        ) : (
          <TabView
            navigationState={{ index: currentIndex, routes: unifiedRoutes }}
            renderScene={({ route: r }) => renderScene({ route: { ...r } })}
            onIndexChange={setTabIndex}
            renderTabBar={(props) => (
              <CategoryTabBar {...props} evenlyDistributed />
            )}
            initialLayout={{ width: layout.width }}
            style={styles.tabView}
          />
        )
      ) : (
        <>
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
        </>
      )}
    </View>
  );
};

export default SearchScreen;
