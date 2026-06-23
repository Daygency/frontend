import { useMemo } from "react";
import { Animated } from "react-native";

type Options = {
  scrollY?: Animated.Value;
  fadeStart?: number;
  fadeEnd?: number;
  overlay?: boolean;
};

export function useHeaderScrollFade({
  scrollY,
  fadeStart = 0,
  fadeEnd = 1,
  overlay = false,
}: Options) {
  const useScrollFade = scrollY != null;

  return useMemo(() => {
    const solidOpacity = useScrollFade
      ? scrollY.interpolate({
          inputRange: [fadeStart, fadeEnd],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : overlay
        ? 0
        : 1;

    const overlayOpacity = useScrollFade
      ? scrollY.interpolate({
          inputRange: [fadeStart, fadeEnd],
          outputRange: [1, 0],
          extrapolate: "clamp",
        })
      : overlay
        ? 1
        : 0;

    return { useScrollFade, solidOpacity, overlayOpacity };
  }, [fadeEnd, fadeStart, overlay, scrollY, useScrollFade]);
}
