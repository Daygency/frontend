import { StyleSheet } from "react-native";
import { MAIN, RED, WHITE } from "../../color";

export const MAIN_HOME_TOP_BAR_PADDING_TOP = 6;
export const MAIN_HOME_TOP_BAR_PADDING_BOTTOM = 10;
/** 상단 타이틀(Logo)과 필터·탭 칩 행 사이 간격 */
export const FILTER_ROW_PADDING_TOP = 4;
export const MAIN_HOME_TOP_BAR_HEIGHT =
  MAIN_HOME_TOP_BAR_PADDING_TOP + 24 + MAIN_HOME_TOP_BAR_PADDING_BOTTOM;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: MAIN_HOME_TOP_BAR_HEIGHT,
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
    paddingTop: MAIN_HOME_TOP_BAR_PADDING_TOP,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  icon: {
    position: "absolute",
    left: 8,
    justifyContent: "center",
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
  },
  dotNew: {
    position: "absolute",
    top: -1,
    right: -3,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: RED.DEFAULT,
  },
});

export default styles;
