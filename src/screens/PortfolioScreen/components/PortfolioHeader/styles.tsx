import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../../../color";
import { MAIN_HOME_TOP_BAR_HEIGHT } from "../../styles";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: MAIN_HOME_TOP_BAR_HEIGHT,
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingTop: 10,
  },
  leftContainer: {
    flexShrink: 1,
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
  activityBar: {
    marginTop: 2,
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  activityBarText: {
    fontSize: 13,
    color: GRAY.DARK,
    fontWeight: "600",
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
