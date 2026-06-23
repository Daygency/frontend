import { StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../../../color";
import {
  MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
  MAIN_HOME_TOP_BAR_TITLE_SIZE,
} from "../../../../components/layout/MainHomeTopBar/styles";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
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
  leftContainer: {
    flexShrink: 1,
    flex: 1,
    marginRight: 12,
  },
  titleStack: {
    position: "relative",
    justifyContent: "center",
  },
  titleSolid: {
    ...StyleSheet.absoluteFillObject,
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
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  iconButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconSolid: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTextContainer: {
    height: 21,
    width: 47,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 11,
    color: WHITE,
    fontWeight: "600",
  },
});

export default styles;
