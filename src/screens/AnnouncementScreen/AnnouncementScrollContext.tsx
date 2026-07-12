import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, type LayoutChangeEvent, type NativeScrollEvent } from "react-native";
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

const DEFAULT_TOP_BAR_HEIGHT = 50;
const DEFAULT_FILTER_BAR_HEIGHT = 48;

type AnnouncementScrollContextValue = {
  listTopInset: number;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
};

const AnnouncementScrollContext =
  createContext<AnnouncementScrollContextValue | null>(null);

export function useAnnouncementScroll() {
  const ctx = useContext(AnnouncementScrollContext);
  if (!ctx) {
    throw new Error(
      "useAnnouncementScroll must be used within AnnouncementScrollProvider",
    );
  }
  return ctx;
}

type AnnouncementScrollProviderProps = {
  children: ReactNode;
  topBar: ReactNode;
  filterBar: ReactNode;
  onScrollForPagination?: (event: NativeScrollEvent) => void;
};

export function AnnouncementScrollProvider({
  children,
  topBar,
  filterBar,
  onScrollForPagination,
}: AnnouncementScrollProviderProps) {
  const lastScrollY = useSharedValue(0);
  const headerCollapse = useSharedValue(0);

  const [topBarHeight, setTopBarHeight] = useState(DEFAULT_TOP_BAR_HEIGHT);
  const [filterBarHeight, setFilterBarHeight] = useState(DEFAULT_FILTER_BAR_HEIGHT);

  const listTopInset = topBarHeight + filterBarHeight;
  const maxHeaderCollapse = topBarHeight;

  const onPaginationScroll = useCallback(
    (layoutHeight: number, offsetY: number, contentHeight: number) => {
      onScrollForPagination?.({
        layoutMeasurement: { height: layoutHeight },
        contentOffset: { y: offsetY },
        contentSize: { height: contentHeight },
      } as NativeScrollEvent);
    },
    [onScrollForPagination],
  );

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        "worklet";
        const y = Math.max(0, event.contentOffset.y);
        const delta = y - lastScrollY.value;
        const maxCollapse = maxHeaderCollapse;

        if (y <= 0) {
          headerCollapse.value = 0;
        } else if (delta > 0) {
          headerCollapse.value = Math.min(headerCollapse.value + delta, maxCollapse);
        } else if (delta < 0) {
          headerCollapse.value = Math.max(0, headerCollapse.value + delta);
        }

        lastScrollY.value = y;

        if (onScrollForPagination) {
          runOnJS(onPaginationScroll)(
            event.layoutMeasurement.height,
            y,
            event.contentSize.height,
          );
        }
      },
    },
    [maxHeaderCollapse, onScrollForPagination],
  );

  // 탭을 벗어났다가 돌아오면 스크롤 위치는 유지하되 숨겨진 헤더는 다시 보이게 한다.
  useFocusEffect(
    useCallback(() => {
      headerCollapse.value = withTiming(0, { duration: 200 });
    }, [headerCollapse]),
  );

  const value = useMemo(
    () => ({
      listTopInset,
      scrollHandler,
    }),
    [listTopInset, scrollHandler],
  );

  return (
    <AnnouncementScrollContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        <AnnouncementCollapsibleChrome
          headerCollapse={headerCollapse}
          topBarHeight={topBarHeight}
          onTopBarLayout={setTopBarHeight}
          onFilterBarLayout={setFilterBarHeight}
          topBar={topBar}
          filterBar={filterBar}
        />
      </View>
    </AnnouncementScrollContext.Provider>
  );
}

type AnnouncementCollapsibleChromeProps = {
  topBar: ReactNode;
  filterBar: ReactNode;
  headerCollapse: SharedValue<number>;
  topBarHeight: number;
  onTopBarLayout: (height: number) => void;
  onFilterBarLayout: (height: number) => void;
};

function AnnouncementCollapsibleChrome({
  topBar,
  filterBar,
  headerCollapse,
  topBarHeight,
  onTopBarLayout,
  onFilterBarLayout,
}: AnnouncementCollapsibleChromeProps) {
  const topBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: -interpolate(
          headerCollapse.value,
          [0, topBarHeight],
          [0, topBarHeight],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }), [topBarHeight]);

  const filterBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: -interpolate(
          headerCollapse.value,
          [0, topBarHeight],
          [0, topBarHeight],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }), [topBarHeight]);

  const handleTopBarLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0) {
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
        style={[chromeStyles.headerClip, { height: topBarHeight }]}
      >
        <Animated.View
          onLayout={handleTopBarLayout}
          style={[chromeStyles.topBarSlot, topBarStyle]}
        >
          {topBar}
        </Animated.View>
      </View>
      <Animated.View
        style={[chromeStyles.filterBar, { top: topBarHeight }, filterBarStyle]}
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
  filterBar: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    zIndex: 21,
  },
};
