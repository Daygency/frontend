import { StyleSheet } from "react-native";
import { BLACK, MAIN } from "../../../../../color";
import {
  MAIN_HOME_TOP_BAR_HEIGHT,
  MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
  MAIN_HOME_TOP_BAR_PADDING_TOP,
} from "../../../../../components/layout/MainHomeTopBar/styles";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: MAIN_HOME_TOP_BAR_HEIGHT,
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
    paddingTop: MAIN_HOME_TOP_BAR_PADDING_TOP,
  },
  title: {
    marginLeft: 4,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: BLACK,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
  },
});

export default styles;

