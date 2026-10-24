import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type ScrollView,
} from "react-native";
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
const DEFAULT_FILTER_BAR_HEIGHT = 48;

type AnnouncementScrollContextValue = {
  listTopInset: number;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  setActiveScrollRef: (node: ScrollView | null) => void;
  scrollToTop: () => void;
  isScrolledDown: () => boolean;
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

export type AnnouncementScrollProviderHandle = {
  /** 리스트 스크롤 위치는 유지한 채 접혀 있던 헤더만 다시 펼친다. */
  resetHeader: () => void;
};

export const AnnouncementScrollProvider = forwardRef<
  AnnouncementScrollProviderHandle,
  AnnouncementScrollProviderProps
>(function AnnouncementScrollProvider(
  { children, topBar, filterBar, onScrollForPagination },
  ref,
) {
  const lastScrollY = useSharedValue(0);
  const headerCollapse = useSharedValue(0);

  const [topBarHeight, setTopBarHeight] = useState(DEFAULT_TOP_BAR_HEIGHT);
  const [filterBarHeight, setFilterBarHeight] = useState(DEFAULT_FILTER_BAR_HEIGHT);

  const listTopInset = topBarHeight + filterBarHeight;
  const maxHeaderCollapse = topBarHeight;

  const activeScrollViewRef = useRef<ScrollView | null>(null);
  const scrollOffsetRef = useRef(0);

  const setActiveScrollRef = useCallback((node: ScrollView | null) => {
    activeScrollViewRef.current = node;
  }, []);

  const onOffsetChange = useCallback((offsetY: number) => {
    scrollOffsetRef.current = offsetY;
  }, []);

  const scrollToTop = useCallback(() => {
    activeScrollViewRef.current?.scrollTo({ y: 0, animated: true });
    headerCollapse.value = withTiming(0, { duration: 200 });
  }, [headerCollapse]);

  const isScrolledDown = useCallback(() => {
    return (
      scrollOffsetRef.current > TAB_RESCROLL_THRESHOLD ||
      headerCollapse.value > TAB_RESCROLL_THRESHOLD
    );
  }, [headerCollapse]);

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
        runOnJS(onOffsetChange)(y);

        if (onScrollForPagination) {
          runOnJS(onPaginationScroll)(
            event.layoutMeasurement.height,
            y,
            event.contentSize.height,
          );
        }
      },
    },
    [maxHeaderCollapse, onOffsetChange, onScrollForPagination],
  );

  const resetHeader = useCallback(() => {
    headerCollapse.value = withTiming(0, { duration: 200 });
  }, [headerCollapse]);

  useImperativeHandle(ref, () => ({ resetHeader }), [resetHeader]);

  const value = useMemo(
    () => ({
      listTopInset,
      scrollHandler,
      setActiveScrollRef,
      scrollToTop,
      isScrolledDown,
    }),
    [isScrolledDown, listTopInset, scrollHandler, scrollToTop, setActiveScrollRef],
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
});

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
    onTopBarLayout(event.nativeEvent.layout.height);
  };

  const handleFilterBarLayout = (event: LayoutChangeEvent) => {
    onFilterBarLayout(event.nativeEvent.layout.height);
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
