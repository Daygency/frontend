import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabView } from "react-native-tab-view";
import styles from "./styles";
import MainHomeTopBar from "../../components/layout/MainHomeTopBar";
import MainHomeHeader, {
  LOUNGE_TABS,
  type LoungeTab,
} from "../../components/layout/MainHomeHeader";
import ContentRegistrationFabButton from "../../components/ui/FabButton/ContentRegistrationFabButton";
import MusicNewsScene from "./components/MusicNewsScene";
import CommunityScene from "./components/CommunityScene";
import LoungePerformanceNewsFilterRow from "./components/LoungePerformanceNewsFilterRow";
import LoungeCommunityTagRow, {
  type LoungeCommunityTagOption,
} from "./components/LoungeCommunityTagRow";
import PerformanceNewsFilterSheet from "./components/PerformanceNewsFilterSheet";
import {
  type PerformanceNewsFilterSheetType,
  type PerformanceNewsSortMode,
} from "./components/performanceNewsFilterOptions";
import { ContentRoutes } from "../../navigations/routes";
import { registerTabRetapHandler } from "../../lib/navigation/tabRetap";
import { useLoungeCollapsibleHeader } from "./useLoungeCollapsibleHeader";

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
  const route = useRoute<RouteProp<{ Lounge: LoungeRouteParams }, "Lounge">>();
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(() =>
    tabToIndex(resolveInitialTab(route.params?.initialTab)),
  );
  const [sortMode, setSortMode] = useState<PerformanceNewsSortMode>("imminent");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCommunityTag, setSelectedCommunityTag] =
    useState<LoungeCommunityTagOption>("전체");
  const [filterSheet, setFilterSheet] = useState<PerformanceNewsFilterSheetType | null>(
    null,
  );

  const activeTab = useMemo(
    () => LOUNGE_TABS[index] ?? "공연 소식",
    [index],
  );

  const {
    setTopBarHeight,
    setTabBarHeight,
    topBarHeight,
    tabBarHeight,
    topBarAnimatedStyle,
    tabBarAnimatedStyle,
    scrollHandlerByTab,
  } = useLoungeCollapsibleHeader(activeTab);
  const topBarMeasuredRef = useRef(false);
  const tabBarMeasuredRef = useRef(false);

  useEffect(() => {
    setIndex(tabToIndex(resolveInitialTab(route.params?.initialTab)));
  }, [route.params?.initialTab]);

  useEffect(() => {
    setFilterSheet(null);
  }, [index]);

  const toggleSubTabRef = useRef(() => {});
  toggleSubTabRef.current = () => {
    setIndex((prev) => (prev === 0 ? 1 : 0));
  };

  useEffect(() => {
    return registerTabRetapHandler(ContentRoutes.CHAT, () => {
      toggleSubTabRef.current();
    });
  }, []);

  const loungeTabHeader = (
    <MainHomeHeader
      tabs={LOUNGE_TABS}
      activeTab={activeTab}
      onTabChange={(tab) => setIndex(tabToIndex(tab as LoungeTab))}
      dense
    />
  );

  const filterRow =
    activeTab === "공연 소식" ? (
      <LoungePerformanceNewsFilterRow
        sortMode={sortMode}
        selectedGenre={selectedGenre}
        selectedRegion={selectedRegion}
        onFilterSheetOpen={setFilterSheet}
      />
    ) : (
      <LoungeCommunityTagRow
        selectedTag={selectedCommunityTag}
        onSelectTag={setSelectedCommunityTag}
      />
    );

  const renderScene = ({ route: sceneRoute }: { route: { key: string } }) => {
    switch (sceneRoute.key) {
      case "공연 소식":
        return (
          <MusicNewsScene
            sortMode={sortMode}
            selectedGenre={selectedGenre}
            selectedRegion={selectedRegion}
            onListScroll={scrollHandlerByTab["공연 소식"]}
          />
        );
      case "커뮤니티":
        return (
          <CommunityScene
            selectedTag={selectedCommunityTag}
            onListScroll={scrollHandlerByTab.커뮤니티}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={[styles.collapsibleTopBar, { height: topBarHeight }]}>
        <Animated.View style={topBarAnimatedStyle}>
          <View
            onLayout={(event) => {
              if (topBarMeasuredRef.current) return;
              const nextHeight = event.nativeEvent.layout.height;
              if (nextHeight > 0) {
                topBarMeasuredRef.current = true;
                setTopBarHeight(nextHeight);
              }
            }}
          >
            <MainHomeTopBar
              logoName="라운지"
              initialTag={TAB_TO_SEARCH_TAG[activeTab]}
            />
          </View>
        </Animated.View>
      </View>
      <View style={[styles.collapsibleTabBar, { height: tabBarHeight }]}>
        <Animated.View style={tabBarAnimatedStyle}>
          <View
            onLayout={(event) => {
              if (tabBarMeasuredRef.current) return;
              const nextHeight = event.nativeEvent.layout.height;
              if (nextHeight > 0) {
                tabBarMeasuredRef.current = true;
                setTabBarHeight(nextHeight);
              }
            }}
          >
            {loungeTabHeader}
          </View>
        </Animated.View>
      </View>
      <View style={styles.filterBar}>{filterRow}</View>
      <View style={styles.body}>
        <TabView
          navigationState={{ index, routes: LOUNGE_ROUTES }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={() => null}
          swipeEnabled={false}
          animationEnabled={false}
          style={styles.tabView}
        />
        <ContentRegistrationFabButton containerStyle={styles.fab} />
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
