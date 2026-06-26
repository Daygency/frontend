import { useMemo, useState } from "react";
import {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import type { LoungeTab } from "../../components/layout/MainHomeHeader";

const DEFAULT_TOP_BAR_HEIGHT = 50;
const DEFAULT_TAB_BAR_HEIGHT = 42;

function clampScrollOffset(y: number, contentHeight: number, layoutHeight: number) {
  "worklet";
  const maxY = Math.max(0, contentHeight - layoutHeight);
  return Math.min(Math.max(0, y), maxY);
}

export function useLoungeCollapsibleHeader(activeTab: LoungeTab) {
  const scrollYNews = useSharedValue(0);
  const scrollYCommunity = useSharedValue(0);
  const [topBarHeight, setTopBarHeight] = useState(DEFAULT_TOP_BAR_HEIGHT);
  const [tabBarHeight, setTabBarHeight] = useState(DEFAULT_TAB_BAR_HEIGHT);

  const scrollYByTab = useMemo(
    () => ({
      "공연 소식": scrollYNews,
      커뮤니티: scrollYCommunity,
    }),
    [scrollYCommunity, scrollYNews],
  );

  const scrollY = scrollYByTab[activeTab];

  const newsScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollYNews.value = clampScrollOffset(
        event.contentOffset.y,
        event.contentSize.height,
        event.layoutMeasurement.height,
      );
    },
  });

  const communityScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollYCommunity.value = clampScrollOffset(
        event.contentOffset.y,
        event.contentSize.height,
        event.layoutMeasurement.height,
      );
    },
  });

  const scrollHandlerByTab = useMemo(
    () => ({
      "공연 소식": newsScrollHandler,
      커뮤니티: communityScrollHandler,
    }),
    [communityScrollHandler, newsScrollHandler],
  );

  const topBarAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: -interpolate(
            scrollY.value,
            [0, topBarHeight],
            [0, topBarHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }),
    [topBarHeight],
  );

  const tabBarAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: -interpolate(
            scrollY.value,
            [topBarHeight, topBarHeight + tabBarHeight],
            [0, tabBarHeight],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }),
    [tabBarHeight, topBarHeight],
  );

  return {
    topBarHeight,
    setTopBarHeight,
    tabBarHeight,
    setTabBarHeight,
    topBarAnimatedStyle,
    tabBarAnimatedStyle,
    scrollHandlerByTab,
  };
}
