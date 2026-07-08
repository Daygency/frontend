import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from "./styles";
import { useLoungeTabFade } from "./useLoungeTabFade";
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
  activeTab: LoungeTab;
  sortMode: PerformanceNewsSortMode;
  selectedGenre: string | null;
  selectedRegion: string | null;
  selectedCommunityTag: LoungeCommunityTagOption;
};

const LoungeTabBody = ({
  index,
  activeTab,
  sortMode,
  selectedGenre,
  selectedRegion,
  selectedCommunityTag,
}: LoungeTabBodyProps) => {
  const { newsStyle, communityStyle } = useLoungeTabFade(index);

  return (
    <View style={styles.body}>
      <Animated.View
        style={[styles.sceneLayer, newsStyle]}
        pointerEvents={index === 0 ? "auto" : "none"}
      >
        <MusicNewsScene
          sortMode={sortMode}
          selectedGenre={selectedGenre}
          selectedRegion={selectedRegion}
        />
      </Animated.View>
      <Animated.View
        style={[styles.sceneLayer, communityStyle]}
        pointerEvents={index === 1 ? "auto" : "none"}
      >
        <CommunityScene selectedTag={selectedCommunityTag} />
      </Animated.View>
      <ContentRegistrationFabButton containerStyle={styles.fab} />
    </View>
  );
};

const LoungeScreen = () => {
  const route = useRoute<RouteProp<{ Lounge: LoungeRouteParams }, "Lounge">>();
  const { top } = useSafeAreaInsets();

  const [index, setIndex] = useState(() =>
    tabToIndex(resolveInitialTab(route.params?.initialTab)),
  );
  const [sortMode, setSortMode] = useState<PerformanceNewsSortMode>("created");
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
          activeTab={activeTab}
          sortMode={sortMode}
          selectedGenre={selectedGenre}
          selectedRegion={selectedRegion}
          selectedCommunityTag={selectedCommunityTag}
        />
      </LoungeScrollProvider>
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

export default LoungeScreen;
