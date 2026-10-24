import { GRAY, WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
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
}));

export default styles;
