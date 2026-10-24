import { GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: GRAY.DARK_100,
    marginBottom: 12,
    marginTop: 24,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: WHITE,
  },
  inquiryButton: {
    backgroundColor: MAIN.FILL,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  inquiryButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
  historyCount: {
    fontSize: 14,
    fontWeight: "600",
    color: GRAY.DARK_100,
    marginBottom: 12,
  },
  filterTags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  historyList: {
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  loadMoreButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.DARK_2,
    minHeight: 48,
  },
  loadMoreButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: GRAY.DARK_100,
  },
}));

export default styles;
