import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
  },
  typeTag: {
    backgroundColor: GRAY.DARK_1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeTagText: {
    fontSize: 12,
    lineHeight: 13,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  statusTag: {
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusTagText: {
    fontSize: 12,
    lineHeight: 13,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  countdownBadge: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  countdownText: {
    fontSize: 12,
    lineHeight: 13,
    color: WHITE,
    fontWeight: "500",
  },
  title: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: "600",
    color: BLACK,
  },
  priceLine: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: GRAY.DARK_2,
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

export default styles;