import { StyleSheet } from "react-native";
import { GRAY } from "../../../../color";

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM_2,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "400",
  },
});

export default styles;
