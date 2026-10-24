import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, type FlatList, type LayoutChangeEvent } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { TAB_RESCROLL_THRESHOLD } from "../../lib/navigation/tabRetap";
import { WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const DEFAULT_TOP_BAR_HEIGHT = 50;
const DEFAULT_FILTER_BAR_HEIGHT = 45;

type LoungeScrollContextValue = {
  listTopInset: number;
  newsScrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  communityScrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  setNewsListRef: (node: FlatList | null) => void;
  setCommunityListRef: (node: FlatList | null) => void;
  scrollActiveTabToTop: () => void;
  isActiveTabScrolledDown: () => boolean;
};

const LoungeScrollContext = createContext<LoungeScrollContextValue | null>(null);

export function useLoungeScroll() {
  const ctx = useContext(LoungeScrollContext);
  if (!ctx) {
    throw new Error("useLoungeScroll must be used within LoungeScrollProvider");
  }
  return ctx;
}

type LoungeScrollProviderProps = {
  children: ReactNode;
  topBar: ReactNode;
  filterBar: ReactNode;
  activeTabIndex: number;
};

function useLoungeScrollHandler(
  scrollY: SharedValue<number>,
  lastScrollY: SharedValue<number>,
  headerCollapse: SharedValue<number>,
  maxCollapse: number,
  onOffsetChange: (offsetY: number) => void,
) {
  return useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      const y = Math.max(0, event.contentOffset.y);
      const delta = y - lastScrollY.value;

      if (y <= 0) {
        headerCollapse.value = 0;
      } else if (delta > 0) {
        headerCollapse.value = Math.min(headerCollapse.value + delta, maxCollapse);
      } else if (delta < 0) {
        headerCollapse.value = Math.max(0, headerCollapse.value + delta);
      }

      lastScrollY.value = y;
      scrollY.value = y;
      runOnJS(onOffsetChange)(y);
    },
  });
}

export function LoungeScrollProvider({
  children,
  topBar,
  filterBar,
  activeTabIndex: activeTabIndexProp,
}: LoungeScrollProviderProps) {
  const scrollYNews = useSharedValue(0);
  const scrollYCommunity = useSharedValue(0);
  const lastScrollYNews = useSharedValue(0);
  const lastScrollYCommunity = useSharedValue(0);
  const headerCollapseNews = useSharedValue(0);
  const headerCollapseCommunity = useSharedValue(0);
  const activeTabIndex = useSharedValue(activeTabIndexProp);

  const newsListRef = useRef<FlatList | null>(null);
  const communityListRef = useRef<FlatList | null>(null);
  const scrollOffsetNewsRef = useRef(0);
  const scrollOffsetCommunityRef = useRef(0);

  const onNewsOffsetChange = useCallback((offsetY: number) => {
    scrollOffsetNewsRef.current = offsetY;
  }, []);

  const onCommunityOffsetChange = useCallback((offsetY: number) => {
    scrollOffsetCommunityRef.current = offsetY;
  }, []);

  const setNewsListRef = useCallback((node: FlatList | null) => {
    newsListRef.current = node;
  }, []);

  const setCommunityListRef = useCallback((node: FlatList | null) => {
    communityListRef.current = node;
  }, []);

  const [topBarHeight, setTopBarHeight] = useState(DEFAULT_TOP_BAR_HEIGHT);
  const [filterBarHeight, setFilterBarHeight] = useState(DEFAULT_FILTER_BAR_HEIGHT);

  const headerTotalHeight = topBarHeight;
  const listTopInset = headerTotalHeight + filterBarHeight;
  const maxHeaderCollapse = headerTotalHeight;

  useLayoutEffect(() => {
    activeTabIndex.value = activeTabIndexProp;
  }, [activeTabIndex, activeTabIndexProp]);

  const newsScrollHandler = useLoungeScrollHandler(
    scrollYNews,
    lastScrollYNews,
    headerCollapseNews,
    maxHeaderCollapse,
    onNewsOffsetChange,
  );

  const communityScrollHandler = useLoungeScrollHandler(
    scrollYCommunity,
    lastScrollYCommunity,
    headerCollapseCommunity,
    maxHeaderCollapse,
    onCommunityOffsetChange,
  );

  const resetNewsScroll = useCallback(() => {
    scrollYNews.value = 0;
    lastScrollYNews.value = 0;
    headerCollapseNews.value = 0;
    scrollOffsetNewsRef.current = 0;
  }, [headerCollapseNews, lastScrollYNews, scrollYNews]);

  const resetCommunityScroll = useCallback(() => {
    scrollYCommunity.value = 0;
    lastScrollYCommunity.value = 0;
    headerCollapseCommunity.value = 0;
    scrollOffsetCommunityRef.current = 0;
  }, [headerCollapseCommunity, lastScrollYCommunity, scrollYCommunity]);

  const scrollActiveTabToTop = useCallback(() => {
    if (activeTabIndexProp === 0) {
      newsListRef.current?.scrollToOffset({ offset: 0, animated: true });
      resetNewsScroll();
      return;
    }
    communityListRef.current?.scrollToOffset({ offset: 0, animated: true });
    resetCommunityScroll();
  }, [activeTabIndexProp, resetCommunityScroll, resetNewsScroll]);

  const isActiveTabScrolledDown = useCallback(() => {
    if (activeTabIndexProp === 0) {
      return (
        scrollOffsetNewsRef.current > TAB_RESCROLL_THRESHOLD ||
        headerCollapseNews.value > TAB_RESCROLL_THRESHOLD
      );
    }
    return (
      scrollOffsetCommunityRef.current > TAB_RESCROLL_THRESHOLD ||
      headerCollapseCommunity.value > TAB_RESCROLL_THRESHOLD
    );
  }, [activeTabIndexProp, headerCollapseCommunity, headerCollapseNews]);

  // 탭을 벗어났다가 돌아오면 스크롤 위치는 유지하되 숨겨진 헤더는 다시 보이게 한다.
  useFocusEffect(
    useCallback(() => {
      headerCollapseNews.value = withTiming(0, { duration: 200 });
      headerCollapseCommunity.value = withTiming(0, { duration: 200 });
    }, [headerCollapseCommunity, headerCollapseNews]),
  );

  const value = useMemo(
    () => ({
      listTopInset,
      newsScrollHandler,
      communityScrollHandler,
      setNewsListRef,
      setCommunityListRef,
      scrollActiveTabToTop,
      isActiveTabScrolledDown,
    }),
    [
      communityScrollHandler,
      isActiveTabScrolledDown,
      listTopInset,
      newsScrollHandler,
      scrollActiveTabToTop,
      setCommunityListRef,
      setNewsListRef,
    ],
  );

  return (
    <LoungeScrollContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        <LoungeCollapsibleChrome
          activeTabIndex={activeTabIndex}
          headerCollapseNews={headerCollapseNews}
          headerCollapseCommunity={headerCollapseCommunity}
          topBarHeight={topBarHeight}
          headerTotalHeight={headerTotalHeight}
          onTopBarLayout={setTopBarHeight}
          onFilterBarLayout={setFilterBarHeight}
          topBar={topBar}
          filterBar={filterBar}
        />
      </View>
    </LoungeScrollContext.Provider>
  );
}

type LoungeCollapsibleChromeProps = {
  topBar: ReactNode;
  filterBar: ReactNode;
  activeTabIndex: SharedValue<number>;
  headerCollapseNews: SharedValue<number>;
  headerCollapseCommunity: SharedValue<number>;
  topBarHeight: number;
  headerTotalHeight: number;
  onTopBarLayout: (height: number) => void;
  onFilterBarLayout: (height: number) => void;
};

function getHeaderCollapse(
  tabIndex: number,
  newsCollapse: number,
  communityCollapse: number,
) {
  "worklet";
  return tabIndex === 0 ? newsCollapse : communityCollapse;
}

function LoungeCollapsibleChrome({
  topBar,
  filterBar,
  activeTabIndex,
  headerCollapseNews,
  headerCollapseCommunity,
  topBarHeight,
  headerTotalHeight,
  onTopBarLayout,
  onFilterBarLayout,
}: LoungeCollapsibleChromeProps) {
  const topBarMeasured = useRef(false);

  const topBarStyle = useAnimatedStyle(() => {
    const collapse = getHeaderCollapse(
      activeTabIndex.value,
      headerCollapseNews.value,
      headerCollapseCommunity.value,
    );
    return {
      transform: [
        {
          translateY: -interpolate(
            collapse,
            [0, topBarHeight],
            [0, topBarHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [topBarHeight]);

  const filterBarStyle = useAnimatedStyle(() => {
    const collapse = getHeaderCollapse(
      activeTabIndex.value,
      headerCollapseNews.value,
      headerCollapseCommunity.value,
    );
    return {
      transform: [
        {
          translateY: -interpolate(
            collapse,
            [0, headerTotalHeight],
            [0, headerTotalHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [headerTotalHeight]);

  const handleTopBarLayout = (event: LayoutChangeEvent) => {
    if (topBarMeasured.current) return;
    const height = event.nativeEvent.layout.height;
    if (height > 0) {
      topBarMeasured.current = true;
      onTopBarLayout(height);
    }
  };

  const handleFilterBarLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0) onFilterBarLayout(height);
  };

  return (
    <View pointerEvents="box-none" style={chromeStyles.root}>
      <View
        pointerEvents="box-none"
        style={[chromeStyles.headerClip, { height: headerTotalHeight }]}
      >
        <Animated.View
          onLayout={handleTopBarLayout}
          style={[chromeStyles.topBarSlot, topBarStyle]}
        >
          {topBar}
        </Animated.View>
      </View>
      <Animated.View
        style={[chromeStyles.filterBar, { top: headerTotalHeight }, filterBarStyle]}
        onLayout={handleFilterBarLayout}
      >
        {filterBar}
      </Animated.View>
    </View>
  );
}

const chromeStyles = themedStyles(() => ({
  root: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  headerClip: {
    overflow: "hidden" as const,
  },
  topBarSlot: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
  },
  filterBar: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    zIndex: 21,
  },
}));
