import { StyleSheet } from "react-native";
import { WHITE } from "../../../../../color";

export default StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
  },
  titleWithCount: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 0,
  },
  personCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flexShrink: 0,
  },
  personCountText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: "#6B7280",
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
});
