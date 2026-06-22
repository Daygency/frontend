import { StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../../../color";
import {
  MAIN_HOME_TOP_BAR_HEIGHT,
  MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
  MAIN_HOME_TOP_BAR_PADDING_TOP,
} from "../../../../components/MainHomeTopBar/styles";

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
  leftContainer: {
    flexShrink: 1,
    flex: 1,
    marginRight: 12,
  },
  handleText: {
    fontSize: 24,
    fontWeight: "700",
    color: MAIN.DEFAULT,
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
