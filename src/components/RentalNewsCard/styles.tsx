import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueName: {
    fontSize: 14,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  date: {
    fontSize: 14,
    fontWeight: "400",
    color: GRAY.DARK,
  },
});

export default styles;

