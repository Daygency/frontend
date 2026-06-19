import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: WHITE,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  title: {
    flexShrink: 1,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
    color: BLACK,
  },
  timestamp: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.DARK_2,
  },
  image: {
    backgroundColor: WHITE,
  },
});

export default styles;
