import { StyleSheet } from "react-native";
import { BLACK, MAIN } from "../../../../../color";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 6,
    minHeight: 44,
  },
  title: {
    marginLeft: 4,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: BLACK,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;

