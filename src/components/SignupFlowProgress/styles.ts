import { StyleSheet } from "react-native";
import { MAIN, GRAY } from "../../color";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: MAIN.DEFAULT,
  },
  dotInactive: {
    backgroundColor: GRAY.MEDIUM_2,
  },
});
