import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { TabView } from "react-native-tab-view";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SearchResultsHeader from "./components/SearchResultsHeader";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import {
  CategoryList,
  TAG_TO_SEARCH_CATEGORY,
} from "../../constants/categories";
import { renderSearchScene } from "../SearchScreen/scenes/SearchTabScenes";
import styles from "./styles";

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
  const [selectedTags] = useState<string[]>(initialTags);
  const [tabIndex, setTabIndex] = useState(0);
  const query = route.params?.query ?? "";

  const taggedRoutes = useMemo(() => {
    const seen = new Set<string>();
    const routes: { key: string; title: string }[] = [];
    selectedTags.forEach((tag) => {
      const mapped = TAG_TO_SEARCH_CATEGORY[tag];
      if (mapped && !seen.has(mapped)) {
        seen.add(mapped);
        routes.push({ key: mapped, title: mapped });
      }
    });
    return routes;
  }, [selectedTags]);

  const routes =
    selectedTags.length === 0
      ? CategoryList.map((category) => ({ key: category, title: category }))
      : taggedRoutes;
  const currentIndex = Math.min(tabIndex, Math.max(routes.length - 1, 0));
  const selectedTag = selectedTags[0] ?? null;

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <SearchResultsHeader
        selectedTag={selectedTag}
        onBack={() => navigation.goBack()}
        onResetSearch={() => navigation.goBack()}
      />
      {routes.length === 1 ? (
        <View style={{ flex: 1 }}>
          {renderSearchScene(routes[0].key, query)}
        </View>
      ) : (
        <TabView
          navigationState={{ index: currentIndex, routes }}
          renderScene={({ route: r }) => renderSearchScene(r.key, query)}
          onIndexChange={setTabIndex}
          renderTabBar={(props) => (
            <CategoryTabBar
              {...props}
              evenlyDistributed={routes.length >= 4}
            />
          )}
          initialLayout={{ width: layout.width }}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};

export default SearchResultsScreen;
