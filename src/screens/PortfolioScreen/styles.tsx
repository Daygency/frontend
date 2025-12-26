import { StyleSheet } from "react-native";
import { WHITE } from "../../color";

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
});

export default styles;
