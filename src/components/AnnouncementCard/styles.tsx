import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../color";
import { sharedAnnouncementStyles } from "../AnnouncementShared/sharedAnnouncementStyles";

export default StyleSheet.create({
  ...sharedAnnouncementStyles,
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "80%",
    maxWidth: "80%",
    flexShrink: 1,
  },
  titleInHeader: {
    flex: 1,
    minWidth: 0,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "100%",
  },
  addressInline: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: BLACK,
    fontWeight: "500",
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
