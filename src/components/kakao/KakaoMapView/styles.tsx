import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: GRAY.DEFAULT,
  },
  openBadge: {
    position: "absolute",
    right: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: MAIN.DEFAULT,
  },
  openBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default styles;
