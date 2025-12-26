import { StyleSheet } from "react-native";
import { MAIN, RED, WHITE } from "../../color";

// MainHomeTopBar의 높이 상수 (Logo 24px + paddingBottom 15px + 여유공간)
export const MAIN_HOME_TOP_BAR_HEIGHT = 44;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: MAIN_HOME_TOP_BAR_HEIGHT,
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  portfolioButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 40,
    backgroundColor: MAIN.DEFAULT,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  portfolioTitle: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "500",
    marginLeft: 22,
    lineHeight: 17,
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
