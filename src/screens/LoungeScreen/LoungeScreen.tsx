import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
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
import {
  createSubTabRetapHandler,
  registerTabRetapHandler,
} from "../../lib/navigation/tabRetap";
import { LoungeScrollProvider, useLoungeScroll } from "./LoungeScrollContext";

type LoungeRouteParams = {
  initialTab?: LoungeTab | "음악계 소식";
};

const TAB_TO_SEARCH_TAG: Record<LoungeTab, string> = {
  "공연 소식": "공연소식",
  커뮤니티: "커뮤니티",
};

const LOUNGE_ROUTES = LOUNGE_TABS.map((key) => ({ key, title: key }));

function LoungeTabRetapBridge({ onToggleSubTab }: { onToggleSubTab: () => void }) {
  const { scrollActiveTabToTop, isActiveTabScrolledDown } = useLoungeScroll();

  useEffect(() => {
    return registerTabRetapHandler(
      ContentRoutes.CHAT,
      createSubTabRetapHandler({
        isScrolledDown: isActiveTabScrolledDown,
        scrollToTop: scrollActiveTabToTop,
        toggleSubTab: onToggleSubTab,
      }),
    );
  }, [isActiveTabScrolledDown, onToggleSubTab, scrollActiveTabToTop]);

  return null;
}

function resolveInitialTab(initialTab?: LoungeRouteParams["initialTab"]): LoungeTab {
  if (initialTab === "음악계 소식") return "공연 소식";
  if (initialTab && LOUNGE_TABS.includes(initialTab)) return initialTab;
  return "공연 소식";
}

function tabToIndex(tab: LoungeTab): number {
  const idx = LOUNGE_TABS.indexOf(tab);
  return idx >= 0 ? idx : 0;
}

type LoungeTabBodyProps = {
  index: number;
  setIndex: (index: number) => void;
  activeTab: LoungeTab;
  sortMode: PerformanceNewsSortMode;
  selectedGenre: string | null;
  selectedRegion: string | null;
  selectedCommunityTag: LoungeCommunityTagOption;
  filterSheet: PerformanceNewsFilterSheetType | null;
  setFilterSheet: (sheet: PerformanceNewsFilterSheetType | null) => void;
  setSortMode: (mode: PerformanceNewsSortMode) => void;
  setSelectedGenre: (genre: string | null) => void;
  setSelectedRegion: (region: string | null) => void;
};

const LoungeTabBody = ({
  index,
  setIndex,
  activeTab,
  sortMode,
  selectedGenre,
  selectedRegion,
  selectedCommunityTag,
  filterSheet,
  setFilterSheet,
  setSortMode,
  setSelectedGenre,
  setSelectedRegion,
}: LoungeTabBodyProps) => {
  const layout = useWindowDimensions();

  const renderScene = ({ route: sceneRoute }: { route: { key: string } }) => {
    switch (sceneRoute.key) {
      case "공연 소식":
        return (
          <MusicNewsScene
            sortMode={sortMode}
            selectedGenre={selectedGenre}
            selectedRegion={selectedRegion}
          />
        );
      case "커뮤니티":
        return <CommunityScene selectedTag={selectedCommunityTag} />;
      default:
        return null;
    }
  };

  return (
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
  );
};

const LoungeScreen = () => {
  const route = useRoute<RouteProp<{ Lounge: LoungeRouteParams }, "Lounge">>();
  const { top } = useSafeAreaInsets();

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

  const toggleSubTab = () => {
    setIndex((prev) => (prev === 0 ? 1 : 0));
  };

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

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <LoungeScrollProvider
        activeTabIndex={index}
        topBar={
          <MainHomeTopBar
            logoName="라운지"
            initialTag={TAB_TO_SEARCH_TAG[activeTab]}
          />
        }
        tabBar={
          <MainHomeHeader
            tabs={LOUNGE_TABS}
            activeTab={activeTab}
            onTabChange={(tab) => setIndex(tabToIndex(tab as LoungeTab))}
            dense
          />
        }
        filterBar={<View style={styles.filterBar}>{filterRow}</View>}
      >
        <LoungeTabRetapBridge onToggleSubTab={toggleSubTab} />
        <LoungeTabBody
          index={index}
          setIndex={setIndex}
          activeTab={activeTab}
          sortMode={sortMode}
          selectedGenre={selectedGenre}
          selectedRegion={selectedRegion}
          selectedCommunityTag={selectedCommunityTag}
          filterSheet={filterSheet}
          setFilterSheet={setFilterSheet}
          setSortMode={setSortMode}
          setSelectedGenre={setSelectedGenre}
          setSelectedRegion={setSelectedRegion}
        />
      </LoungeScrollProvider>
    </View>
  );
};

export default LoungeScreen;
