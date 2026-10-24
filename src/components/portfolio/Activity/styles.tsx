import { BLACK, GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
  },
  embeddedContainer: {
    backgroundColor: "transparent",
    marginTop: 0,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  activityItem: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
    flex: 1,
  },
  activityTypeBadge: {
    backgroundColor: MAIN.FILL,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  activityTypeText: {
    fontSize: 11,
    fontWeight: "500",
    color: FIXED_WHITE,
  },
  activityInfo: {
    gap: 8,
  },
  activityInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activityInfoText: {
    fontSize: 13,
    lineHeight: 18,
    color: GRAY.DARK,
    fontWeight: "400",
  },
  hiddenReviewsButton: {
    fontSize: 13,
    fontWeight: "500",
    color: GRAY.DARK_2,
  },
}));

export default styles;
