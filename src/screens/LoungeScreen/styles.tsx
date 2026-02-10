import { StyleSheet } from "react-native";
import { WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabView: {
    flex: 1,
  },
  newsSceneContainer: {
    flex: 1,
  },
  sortFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 9,
    gap: 8,
  },
});

export default styles;
