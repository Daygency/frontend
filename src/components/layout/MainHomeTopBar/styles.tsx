import { StyleSheet } from "react-native";
import { RED } from "../../../color";

export const MAIN_HOME_TOP_BAR_TITLE_SIZE = 22;
export const MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT = 28;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 6,
    minHeight: 44,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  icon: {
    position: "absolute",
    left: 8,
    justifyContent: "center",
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
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
