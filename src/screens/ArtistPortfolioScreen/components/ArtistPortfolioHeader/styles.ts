import { StyleSheet } from "react-native";
import {
  MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
  MAIN_HOME_TOP_BAR_TITLE_SIZE,
} from "../../../../components/layout/MainHomeTopBar/styles";
import { WHITE } from "../../../../color";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingHorizontal: 8,
    overflow: "hidden",
  },
  headerContainerSolid: {
    backgroundColor: WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  topRow: {
    height: MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    marginRight: 8,
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
  backButton: {
    minWidth: 40,
    minHeight: 40,
    padding: 4,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  activityName: {
    fontSize: MAIN_HOME_TOP_BAR_TITLE_SIZE,
    lineHeight: MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
    fontWeight: "700",
    includeFontPadding: false,
  },
  handleTextOverlay: {
    textShadowColor: "rgba(0, 0, 0, 0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  menuButton: {
    minWidth: 44,
    minHeight: 44,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  iconSolid: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  menuPlaceholder: {
    width: 44,
  },
});

export default styles;
