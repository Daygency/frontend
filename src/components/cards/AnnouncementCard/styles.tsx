import { StyleSheet } from "react-native";
import { BLACK } from "../../../color";

export default StyleSheet.create({
  container: {
    width: "100%",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  profileAvatar: {
    flexShrink: 0,
    marginRight: 8,
  },
  authorName: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    marginRight: 8,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: BLACK,
  },
  dDayOnRow: {
    flexShrink: 0,
    textAlign: "right",
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
    width: "100%",
  },
  title: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 15,
    lineHeight: 26,
    letterSpacing: -0.2,
    color: BLACK,
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    width: "100%",
  },
  locationTagText: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: BLACK,
    fontWeight: "500",
  },
});
