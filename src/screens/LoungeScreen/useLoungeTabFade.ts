import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const FADE_DURATION_MS = 180;

export const useLoungeTabFade = (index: number) => {
  const newsOpacity = useSharedValue(index === 0 ? 1 : 0);
  const communityOpacity = useSharedValue(index === 1 ? 1 : 0);

  useEffect(() => {
    newsOpacity.value = withTiming(index === 0 ? 1 : 0, {
      duration: FADE_DURATION_MS,
      easing: Easing.out(Easing.quad),
    });
    communityOpacity.value = withTiming(index === 1 ? 1 : 0, {
      duration: FADE_DURATION_MS,
      easing: Easing.out(Easing.quad),
    });
  }, [communityOpacity, index, newsOpacity]);

  const newsStyle = useAnimatedStyle(() => ({ opacity: newsOpacity.value }));
  const communityStyle = useAnimatedStyle(() => ({
    opacity: communityOpacity.value,
  }));

  return { newsStyle, communityStyle };
};
