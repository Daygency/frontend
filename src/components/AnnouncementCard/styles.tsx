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
    gap: 6,
  },
  recruitmentMajorChip: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  recruitmentMajorChipText: {
    fontSize: 11,
    lineHeight: 14,
    color: BLACK,
    fontWeight: "400",
  },
});
