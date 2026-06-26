import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { View, type LayoutChangeEvent } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

const DEFAULT_TOP_BAR_HEIGHT = 50;
const DEFAULT_TAB_BAR_HEIGHT = 42;
const DEFAULT_FILTER_BAR_HEIGHT = 45;

type LoungeScrollContextValue = {
  listTopInset: number;
  newsScrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  communityScrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
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
  tabBar: ReactNode;
  filterBar: ReactNode;
  activeTabIndex: number;
};

export function LoungeScrollProvider({
  children,
  topBar,
  tabBar,
  filterBar,
  activeTabIndex: activeTabIndexProp,
}: LoungeScrollProviderProps) {
  const scrollYNews = useSharedValue(0);
  const scrollYCommunity = useSharedValue(0);
  const activeTabIndex = useSharedValue(activeTabIndexProp);

  const [topBarHeight, setTopBarHeight] = useState(DEFAULT_TOP_BAR_HEIGHT);
  const [tabBarHeight, setTabBarHeight] = useState(DEFAULT_TAB_BAR_HEIGHT);
  const [filterBarHeight, setFilterBarHeight] = useState(DEFAULT_FILTER_BAR_HEIGHT);

  const headerTotalHeight = topBarHeight + tabBarHeight;
  const listTopInset = headerTotalHeight + filterBarHeight;

  useLayoutEffect(() => {
    activeTabIndex.value = activeTabIndexProp;
  }, [activeTabIndex, activeTabIndexProp]);

  const newsScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      const y = event.contentOffset.y;
      scrollYNews.value = y > 0 ? y : 0;
    },
  });

  const communityScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      const y = event.contentOffset.y;
      scrollYCommunity.value = y > 0 ? y : 0;
    },
  });

  const value = useMemo(
    () => ({
      listTopInset,
      newsScrollHandler,
      communityScrollHandler,
    }),
    [communityScrollHandler, listTopInset, newsScrollHandler],
  );

  return (
    <LoungeScrollContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        <LoungeCollapsibleChrome
          activeTabIndex={activeTabIndex}
          scrollYNews={scrollYNews}
          scrollYCommunity={scrollYCommunity}
          topBarHeight={topBarHeight}
          tabBarHeight={tabBarHeight}
          headerTotalHeight={headerTotalHeight}
          onTopBarLayout={setTopBarHeight}
          onTabBarLayout={setTabBarHeight}
          onFilterBarLayout={setFilterBarHeight}
          topBar={topBar}
          tabBar={tabBar}
          filterBar={filterBar}
        />
      </View>
    </LoungeScrollContext.Provider>
  );
}

type LoungeCollapsibleChromeProps = {
  topBar: ReactNode;
  tabBar: ReactNode;
  filterBar: ReactNode;
  activeTabIndex: SharedValue<number>;
  scrollYNews: SharedValue<number>;
  scrollYCommunity: SharedValue<number>;
  topBarHeight: number;
  tabBarHeight: number;
  headerTotalHeight: number;
  onTopBarLayout: (height: number) => void;
  onTabBarLayout: (height: number) => void;
  onFilterBarLayout: (height: number) => void;
};

function LoungeCollapsibleChrome({
  topBar,
  tabBar,
  filterBar,
  activeTabIndex,
  scrollYNews,
  scrollYCommunity,
  topBarHeight,
  tabBarHeight,
  headerTotalHeight,
  onTopBarLayout,
  onTabBarLayout,
  onFilterBarLayout,
}: LoungeCollapsibleChromeProps) {
  const topBarMeasured = useRef(false);
  const tabBarMeasured = useRef(false);

  const getScrollY = (tabIndex: number, newsY: number, communityY: number) => {
    "worklet";
    return tabIndex === 0 ? newsY : communityY;
  };

  const topBarStyle = useAnimatedStyle(() => {
    const scrollY = getScrollY(
      activeTabIndex.value,
      scrollYNews.value,
      scrollYCommunity.value,
    );
    return {
      transform: [
        {
          translateY: -interpolate(
            scrollY,
            [0, topBarHeight],
            [0, topBarHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [topBarHeight]);

  const tabBarStyle = useAnimatedStyle(() => {
    const scrollY = getScrollY(
      activeTabIndex.value,
      scrollYNews.value,
      scrollYCommunity.value,
    );
    return {
      transform: [
        {
          translateY: -interpolate(
            scrollY,
            [0, headerTotalHeight],
            [0, headerTotalHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [headerTotalHeight]);

  const filterBarStyle = useAnimatedStyle(() => {
    const scrollY = getScrollY(
      activeTabIndex.value,
      scrollYNews.value,
      scrollYCommunity.value,
    );
    return {
      transform: [
        {
          translateY: -interpolate(
            scrollY,
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

  const handleTabBarLayout = (event: LayoutChangeEvent) => {
    if (tabBarMeasured.current) return;
    const height = event.nativeEvent.layout.height;
    if (height > 0) {
      tabBarMeasured.current = true;
      onTabBarLayout(height);
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
        <Animated.View
          onLayout={handleTabBarLayout}
          style={[chromeStyles.tabBarSlot, { top: topBarHeight }, tabBarStyle]}
        >
          {tabBar}
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

const chromeStyles = {
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
    backgroundColor: "#ffffff",
  },
  tabBarSlot: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
  },
  filterBar: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    zIndex: 21,
  },
};
