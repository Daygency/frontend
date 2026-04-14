import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0.3,
    color: BLACK,
    fontWeight: "700",
  },
  priceAndViewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  priceLine: {
    fontSize: 15,
    lineHeight: 22,
    color: GRAY.DARK_2,
    fontWeight: "500",
  },
  priceLineInRow: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  viewCountText: {
    fontSize: 13,
    lineHeight: 22,
    color: GRAY.MEDIUM_100,
    fontWeight: "400",
    flexShrink: 0,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  typeTag: {
    backgroundColor: GRAY.DARK_1,
    borderRadius: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  typeTagText: {
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  statusTag: {
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  statusTagText: {
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  dateText: {
    fontSize: 14,
    color: GRAY.DARK_2,
    fontWeight: "400",
  },
});

export default styles;
