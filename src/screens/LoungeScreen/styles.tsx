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
    paddingTop: 8,
  },
  sortFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
    alignItems: "center",
  },
  sortFilterWrap: {
    flexGrow: 0,
    flexShrink: 0,
  },
});

export default styles;
