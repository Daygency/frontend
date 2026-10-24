import { BLACK, GRAY, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    padding: 16,
    marginBottom: 12,
  },
  containerPressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  applicantButton: {
    backgroundColor: GRAY.MEDIUM_2,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  applicantButtonPressed: {
    backgroundColor: WHITE,
  },
  applicantButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: GRAY.DARK_100,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusDotOpen: {
    backgroundColor: "#22C55E",
  },
  statusDotClosed: {
    backgroundColor: GRAY.MEDIUM_100,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    color: GRAY.DARK,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  completedTag: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  completedTagText: {
    fontSize: 11,
    lineHeight: 14,
    color: GRAY.DARK,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    color: GRAY.DARK,
  },
  divider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM_2,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  statsSeparator: {
    width: 1,
    height: 12,
    backgroundColor: GRAY.DARK_1,
  },
  statsLabel: {
    fontSize: 13,
    color: GRAY.DARK,
  },
  statsValue: {
    fontSize: 13,
    fontWeight: "700",
    color: BLACK,
  },
}));

export default styles;
