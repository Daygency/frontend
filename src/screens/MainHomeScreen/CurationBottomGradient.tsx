import { StyleSheet, useWindowDimensions, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { CURATION_TAB_BAR_COLOR } from "./curationTheme";

const GRADIENT_HEIGHT = 200;

const CurationBottomGradient = () => {
  const { width } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={styles.gradient}>
      <Svg width={width} height={GRADIENT_HEIGHT} pointerEvents="none">
        <Defs>
          <LinearGradient id="curationBottomFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={CURATION_TAB_BAR_COLOR} stopOpacity="0" />
            <Stop offset="1" stopColor={CURATION_TAB_BAR_COLOR} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={width}
          height={GRADIENT_HEIGHT}
          fill="url(#curationBottomFade)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: GRADIENT_HEIGHT,
  },
});

export default CurationBottomGradient;
