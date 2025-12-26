import { StyleSheet } from "react-native";
import { BLACK, MAIN, RED, WHITE } from "../../color";

// MainHomeTopBar의 높이 상수 (Logo 24px + paddingBottom 15px + 여유공간)
export const MAIN_HOME_TOP_BAR_HEIGHT = 55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
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
  icon: {
    position: "absolute",
    left: 8,
    justifyContent: "center",
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
