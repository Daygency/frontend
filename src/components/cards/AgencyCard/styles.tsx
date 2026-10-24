import { BLACK, BLUE, GRAY, MAIN } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";

const styles = themedStyles(() => ({
  container: {},
  header: {
    marginHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: MAIN.DEFAULT,
    flex: 1,
  },
  bookmarkContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  bookmarkCount: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: "400",
    color: BLACK,
    marginTop: 2,
    opacity: 0.6,
  },
  metricsContainer: {
    flexDirection: "row",
    marginTop: -10,
    marginHorizontal: 18,
    gap: 19,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metricText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "400",
    color: BLACK,
  },
  imageSection: {
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginRight: 12,
    marginLeft: 18,
    gap: 8,
  },
  tag: {
    ...SMOOTH_CORNERS,
    backgroundColor: BLUE.LIGHT_1,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
    color: BLACK,
  },
}));

export default styles;