import { StyleSheet } from "react-native";
import { WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
  },
  body: {
    flex: 1,
    position: "relative",
  },
  tabView: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    zIndex: 50,
    elevation: 50,
  },
  newsSceneContainer: {
    flex: 1,
  },
  loungeStickyHeader: {
    backgroundColor: WHITE,
  },
  sortFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 9,
    gap: 8,
    alignItems: "center",
  },
  sortFilterWrap: {
    flexGrow: 0,
    flexShrink: 0,
  },
});

export default styles;
