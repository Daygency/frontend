import { StyleSheet } from "react-native";
import { BLACK, WHITE } from "../../../../color";
import { MAIN_HOME_TOP_BAR_HEIGHT } from "../../../PortfolioScreen/styles";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: MAIN_HOME_TOP_BAR_HEIGHT,
    flexDirection: "row",
    paddingHorizontal: 8,
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 10,
    backgroundColor: WHITE,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  activityName: {
    fontSize: 22,
    fontWeight: "700",
    color: BLACK,
    flex: 1,
  },
});

export default styles;
