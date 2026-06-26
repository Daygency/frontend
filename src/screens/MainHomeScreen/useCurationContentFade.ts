import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const HOME_FADE_OUT_MS = 180;
const CURATION_FADE_IN_DELAY_MS = 120;
const CURATION_FADE_IN_MS = 700;
const CURATION_FADE_OUT_MS = 180;
const HOME_FADE_IN_DELAY_MS = 100;
const HOME_FADE_IN_MS = 400;

export const useCurationContentFade = (isCuration: boolean) => {
  const homeOpacity = useSharedValue(1);
  const curationOpacity = useSharedValue(0);

  useEffect(() => {
    if (isCuration) {
      homeOpacity.value = withTiming(0, {
        duration: HOME_FADE_OUT_MS,
        easing: Easing.out(Easing.quad),
      });
      curationOpacity.value = withDelay(
        CURATION_FADE_IN_DELAY_MS,
        withTiming(1, {
          duration: CURATION_FADE_IN_MS,
          easing: Easing.out(Easing.cubic),
        }),
      );
      return;
    }

    curationOpacity.value = withTiming(0, {
      duration: CURATION_FADE_OUT_MS,
      easing: Easing.out(Easing.quad),
    });
    homeOpacity.value = withDelay(
      HOME_FADE_IN_DELAY_MS,
      withTiming(1, {
        duration: HOME_FADE_IN_MS,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [curationOpacity, homeOpacity, isCuration]);

  const homeContentStyle = useAnimatedStyle(() => ({
    opacity: homeOpacity.value,
  }));

  const curationContentStyle = useAnimatedStyle(() => ({
    opacity: curationOpacity.value,
  }));

  return { homeContentStyle, curationContentStyle };
};
