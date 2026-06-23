import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { TabView } from "react-native-tab-view";
import styles from "./styles";
import MainHomeTopBar from "../../components/layout/MainHomeTopBar";
import MainHomeHeader, {
  LOUNGE_TABS,
  type LoungeTab,
} from "../../components/layout/MainHomeHeader";
import FabButton from "../../components/ui/FabButton";
import MusicNewsScene from "./components/MusicNewsScene";
import CommunityScene from "./components/CommunityScene";
import PerformanceNewsFilterSheet from "./components/PerformanceNewsFilterSheet";
import {
  type PerformanceNewsFilterSheetType,
  type PerformanceNewsSortMode,
} from "./components/performanceNewsFilterOptions";
import { RootRoutes } from "../../navigations/routes";
import { useRequireLogin } from "../../hooks/useRequireLogin";

type LoungeRouteParams = {
  initialTab?: LoungeTab | "음악계 소식";
};

const TAB_TO_SEARCH_TAG: Record<LoungeTab, string> = {
  "공연 소식": "공연소식",
  커뮤니티: "커뮤니티",
};

const LOUNGE_ROUTES = LOUNGE_TABS.map((key) => ({ key, title: key }));

function resolveInitialTab(initialTab?: LoungeRouteParams["initialTab"]): LoungeTab {
  if (initialTab === "음악계 소식") return "공연 소식";
  if (initialTab && LOUNGE_TABS.includes(initialTab)) return initialTab;
  return "공연 소식";
}

function tabToIndex(tab: LoungeTab): number {
  const idx = LOUNGE_TABS.indexOf(tab);
  return idx >= 0 ? idx : 0;
}

const LoungeScreen = () => {
  const navigation = useNavigation<any>();
  const { ensureLoggedIn } = useRequireLogin();
  const route = useRoute<RouteProp<{ Lounge: LoungeRouteParams }, "Lounge">>();
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(() =>
    tabToIndex(resolveInitialTab(route.params?.initialTab)),
  );
  const [sortMode, setSortMode] = useState<PerformanceNewsSortMode>("imminent");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filterSheet, setFilterSheet] = useState<PerformanceNewsFilterSheetType | null>(
    null,
  );

  useEffect(() => {
    setIndex(tabToIndex(resolveInitialTab(route.params?.initialTab)));
  }, [route.params?.initialTab]);

  useEffect(() => {
    setFilterSheet(null);
  }, [index]);

  const activeTab = useMemo(
    () => LOUNGE_TABS[index] ?? "공연 소식",
    [index],
  );

  const renderScene = ({ route: sceneRoute }: { route: { key: string } }) => {
    switch (sceneRoute.key) {
      case "공연 소식":
        return (
          <MusicNewsScene
            sortMode={sortMode}
            selectedGenre={selectedGenre}
            selectedRegion={selectedRegion}
            onFilterSheetOpen={setFilterSheet}
          />
        );
      case "커뮤니티":
        return <CommunityScene />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <MainHomeTopBar
        logoName="라운지"
        initialTag={TAB_TO_SEARCH_TAG[activeTab]}
      />
      <View style={styles.body}>
        <TabView
          navigationState={{ index, routes: LOUNGE_ROUTES }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={() => (
            <MainHomeHeader
              tabs={LOUNGE_TABS}
              activeTab={activeTab}
              onTabChange={(tab) => setIndex(tabToIndex(tab as LoungeTab))}
            />
          )}
          style={styles.tabView}
        />
        <FabButton
          containerStyle={styles.fab}
          menuItems={[
            {
              label: "모집공고",
              onPress: () => {
                if (!ensureLoggedIn()) return;
                navigation.navigate(RootRoutes.ANNOUNCEMENT_REGISTRATION);
              },
            },
            {
              label: "공연 소식",
              onPress: () => {
                if (!ensureLoggedIn()) return;
                navigation.navigate(RootRoutes.MUSIC_NEWS_REGISTRATION);
              },
            },
            {
              label: "커뮤니티",
              onPress: () => {
                if (!ensureLoggedIn()) return;
                navigation.navigate(RootRoutes.COMMUNITY_REGISTRATION);
              },
            },
          ]}
        />
        {filterSheet && activeTab === "공연 소식" ? (
          <PerformanceNewsFilterSheet
            type={filterSheet}
            sortMode={sortMode}
            selectedGenre={selectedGenre}
            selectedRegion={selectedRegion}
            onSelectSort={(mode) => {
              setSortMode(mode);
              setFilterSheet(null);
            }}
            onSelectGenre={(genre) => {
              setSelectedGenre(genre);
              setFilterSheet(null);
            }}
            onSelectRegion={(region) => {
              setSelectedRegion(region);
              setFilterSheet(null);
            }}
            onClose={() => setFilterSheet(null)}
          />
        ) : null}
      </View>
    </View>
  );
};

export default LoungeScreen;
