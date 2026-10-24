import { WHITE, GRAY } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
}));

export default styles;
