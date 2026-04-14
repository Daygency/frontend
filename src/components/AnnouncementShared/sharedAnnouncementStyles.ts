import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../color";

export const sharedAnnouncementStyles = StyleSheet.create({
  title: {
    fontSize: 16,
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
    fontSize: 14,
    lineHeight: 20,
    color: MAIN.DEFAULT,
    fontWeight: "700",
  },
  priceLineFlex: {
    flex: 1,
    minWidth: 0,
  },
  viewCountText: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.MEDIUM_100,
    fontWeight: "400",
    flexShrink: 0,
  },
  dDayText: {
    fontSize: 13,
    lineHeight: 18,
    color: BLACK,
    fontWeight: "800",
    letterSpacing: 0.24,
  },
  dDayTextRed: {
    backgroundColor: RED.DEFAULT,
    color: WHITE,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
    alignItems: "center",
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
});
