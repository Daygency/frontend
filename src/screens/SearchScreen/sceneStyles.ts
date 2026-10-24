import { GRAY, WHITE, BLACK } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  list: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContent: {
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK,
    textAlign: "center",
    lineHeight: 21,
  },
  cardPad: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  newsListContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  newsRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  newsCardWrap: {
    width: "48%",
  },
  allContent: {
    paddingBottom: 32,
  },
  allSection: {
    marginTop: 8,
  },
  allSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  allNewsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
}));

export default styles;
