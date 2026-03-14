import { View, Text, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TabView } from "react-native-tab-view";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SearchResultsHeader from "./components/SearchResultsHeader";
import AllContentScene from "../../components/AllContentScene/AllContentScene";
import ArtistScene from "../MainHomeScreen/scenes/ArtistScene";
import VenueScene from "../MainHomeScreen/scenes/VenueScene";
import AgencyScene from "../MainHomeScreen/scenes/AgencyScene";
import AnnouncementScreen from "../AnnouncementScreen/AnnouncementScreen";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import { CategoryList } from "../../constants/categories";
import styles from "./styles";
import { RootRoutes } from "../../navigations/routes";

// 검색 태그 → 메인 탭 키 매핑
const TAG_TO_CATEGORY: Record<string, { key: string; title: string; initialTab?: "info" | "news" }> = {
  아티스트: { key: "아티스트", title: "아티스트" },
  공연장정보: { key: "공연장", title: "공연장" },
  대관소식: { key: "공연장", title: "공연장", initialTab: "news" },
  기획자: { key: "기획사", title: "기획사" },
  모집공고: { key: "모집공고", title: "모집공고" },
  채용: { key: "모집공고", title: "모집공고" },
  공연소식: { key: "전체", title: "전체" },
  커뮤니티: { key: "전체", title: "전체" },
};

export type SearchResultsParams = {
  selectedTags?: string[];
  query?: string;
};

type RootStackParamList = {
  SearchResults: SearchResultsParams;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SearchResultsRouteProp = RouteProp<RootStackParamList, "SearchResults">;

const SearchResultsScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SearchResultsRouteProp>();
  const initialTags = route.params?.selectedTags ?? [];
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [tabIndex, setTabIndex] = useState(0);

  const isUnifiedSearch = selectedTags.length === 0;

  // 통합 검색: 메인처럼 전체/아티스트/공연장/기획사 탭
  const unifiedRoutes = CategoryList.map((category) => ({
    key: category,
    title: category,
  }));

  // 태그별 검색: 선택된 태그에 해당하는 탭만
  const taggedRoutes = useMemo(() => {
    const seen = new Set<string>();
    const routes: { key: string; title: string; initialTab?: "info" | "news" }[] = [];
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

  const selectedTag = selectedTags[0] ?? null;
  const query = route.params?.query ?? "";

  const renderScene = ({ route: sceneRoute }: { route: { key: string; initialTab?: "info" | "news" } }) => {
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
      <SearchResultsHeader
        selectedTag={selectedTag}
        query={query}
        onBack={() => navigation.goBack()}
        onResetSearch={() => navigation.goBack()}
      />

      {isUnifiedSearch ? (
        <TabView
          navigationState={{ index: currentIndex, routes: unifiedRoutes }}
          renderScene={({ route: r }) => renderScene({ route: { ...r } })}
          onIndexChange={setTabIndex}
          renderTabBar={(props) => <CategoryTabBar {...props} evenlyDistributed />}
          initialLayout={{ width: layout.width }}
          style={styles.tabView}
        />
      ) : routes.length > 0 ? (
        routes.length === 1 ? (
          <View style={styles.tabView}>{renderScene({ route: routes[0] })}</View>
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
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>태그를 선택하면 검색 결과가 표시됩니다</Text>
        </View>
      )}
    </View>
  );
};

export default SearchResultsScreen;
