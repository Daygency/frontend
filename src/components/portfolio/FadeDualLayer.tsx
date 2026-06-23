import type { ReactNode } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { portfolioHeaderStyles } from "./portfolioHeaderStyles";

type FadeOpacity = Animated.AnimatedInterpolation<number> | number;

type Props = {
  overlayOpacity: FadeOpacity;
  solidOpacity: FadeOpacity;
  overlay: ReactNode;
  solid: ReactNode;
  solidStyle?: StyleProp<ViewStyle>;
};

const FadeDualLayer = ({
  overlayOpacity,
  solidOpacity,
  overlay,
  solid,
  solidStyle,
}: Props) => (
  <>
    <Animated.View style={{ opacity: overlayOpacity }}>{overlay}</Animated.View>
    <Animated.View
      style={[portfolioHeaderStyles.iconSolid, solidStyle, { opacity: solidOpacity }]}
    >
      {solid}
    </Animated.View>
  </>
);

export default FadeDualLayer;
