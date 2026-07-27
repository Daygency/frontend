import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../../color";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";

export const sharedAnnouncementStyles = StyleSheet.create({
  title: {
    fontSize: 14,
    lineHeight: 26,
    letterSpacing: 0.3,
    color: BLACK,
    fontWeight: "600",
  },
  priceAndViewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  priceLine: {
    fontSize: 12,
    lineHeight: 20,
    color: MAIN.DEFAULT,
    fontWeight: "400",
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
    fontSize: 12,
    lineHeight: 16,
    color: BLACK,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  dDayTextRed: {
    color: RED.DEFAULT,
  },
  dDayTextGray: {
    color: GRAY.MEDIUM_100,
    fontWeight: "400",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
    alignItems: "center",
  },
  typeTag: {
    ...SMOOTH_CORNERS,
    // backgroundColor: GRAY.DEFAULT,
    backgroundColor: "#EDF2F7", // 하늘색
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  typeTagText: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: BLACK,
    fontWeight: "400",
  },
  statusTag: {
    ...SMOOTH_CORNERS,
    backgroundColor: WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  statusTagText: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: BLACK,
    fontWeight: "400",
  },
});
