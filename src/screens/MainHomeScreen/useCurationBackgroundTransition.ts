import { useEffect } from "react";
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  CURATION_LOADING_BACKGROUND,
  type CurationThemeState,
} from "./curationTheme";
import { WHITE } from "../../color";

const TRANSITION_DURATION_MS = 650;

export const useCurationBackgroundTransition = (
  isCuration: boolean,
  curationTheme: CurationThemeState | null,
) => {
  const progress = useSharedValue(0);
  const fromColor = useSharedValue(CURATION_LOADING_BACKGROUND);
  const toColor = useSharedValue(CURATION_LOADING_BACKGROUND);

  useEffect(() => {
    if (!isCuration) {
      progress.value = 0;
      fromColor.value = CURATION_LOADING_BACKGROUND;
      toColor.value = CURATION_LOADING_BACKGROUND;
      return;
    }

    if (!curationTheme || curationTheme.loading) {
      progress.value = 0;
      fromColor.value = CURATION_LOADING_BACKGROUND;
      toColor.value = CURATION_LOADING_BACKGROUND;
      return;
    }

    const nextColor = curationTheme.backgroundColor;
    if (toColor.value === nextColor && progress.value === 1) {
      return;
    }

    fromColor.value = interpolateColor(
      progress.value,
      [0, 1],
      [fromColor.value, toColor.value],
    );
    toColor.value = nextColor;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: TRANSITION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [
    curationTheme?.backgroundColor,
    curationTheme?.loading,
    fromColor,
    isCuration,
    progress,
    toColor,
  ]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    if (!isCuration) {
      return { backgroundColor: WHITE };
    }

    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [fromColor.value, toColor.value],
      ),
    };
  }, [isCuration]);

  return animatedBackgroundStyle;
};
