import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  targetText: {
    fontSize: 13,
    color: GRAY.DARK_100,
  },
  cancelText: {
    fontSize: 13,
    color: BLACK,
    fontWeight: "600",
  },
});

export default styles;
