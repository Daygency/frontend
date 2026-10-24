import { GRAY, WHITE, BLACK } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tagSummaryWrapper: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  emptyContainer: {
    paddingTop: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: BLACK,
  },
  headerInlineButton: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK_2,
  },
}));

export default styles;
