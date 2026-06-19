import { StyleSheet } from "react-native";
import { BLACK, WHITE } from "../../../../color";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 12,
    paddingTop: 10,
    backgroundColor: WHITE,
  },
  topRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    marginRight: 8,
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
  menuButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  menuPlaceholder: {
    width: 38,
  },
});

export default styles;
