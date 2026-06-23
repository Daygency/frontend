import { StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../color";
import {
  MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
  MAIN_HOME_TOP_BAR_TITLE_SIZE,
} from "../layout/MainHomeTopBar/styles";

export const portfolioHeaderStyles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    overflow: "hidden",
  },
  headerContainerOverlay: {
    backgroundColor: "transparent",
  },
  headerContainerSolid: {
    backgroundColor: WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  topRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  titleStack: {
    flex: 1,
    height: MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
    justifyContent: "center",
  },
  titleSolid: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
  },
  handleText: {
    fontSize: MAIN_HOME_TOP_BAR_TITLE_SIZE,
    lineHeight: MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    includeFontPadding: false,
  },
  handleTextOverlay: {
    textShadowColor: "rgba(0, 0, 0, 0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  iconSolid: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
