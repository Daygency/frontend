import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../color";

// MainHomeTopBar의 높이 상수 (Logo 24px + paddingBottom 15px + 여유공간)
export const MAIN_HOME_TOP_BAR_HEIGHT = 55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  icon: {
    position: "absolute",
    left: 8,
    justifyContent: "center",
  },
  tabView: {
    flex: 1,
  },
  activityBar: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  activityBarText: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
});

export default styles;
