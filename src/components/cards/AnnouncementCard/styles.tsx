import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../../color";

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
    alignItems: "flex-start",
    gap: 4,
    marginBottom: 8,
    width: "100%",
  },
  title: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.2,
    color: BLACK,
    fontWeight: "800",
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    width: "100%",
  },
  locationTag: {
    flexShrink: 1,
    maxWidth: "100%",
    backgroundColor: WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  locationTagText: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: BLACK,
    fontWeight: "400",
  },
  recruitmentMajorsSection: {
    marginTop: 10,
  },
  recruitmentMajorsLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: GRAY.DARK_2,
    fontWeight: "500",
    marginBottom: 6,
  },
  recruitmentMajorsChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  recruitmentMajorChip: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  recruitmentMajorChipText: {
    fontSize: 10,
    lineHeight: 13,
    color: BLACK,
    fontWeight: "400",
  },
});
