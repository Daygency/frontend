import { GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../../color";
import { themedStyles } from "../../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  centeredGrow: {
    flexGrow: 1,
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  emptyWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: GRAY.DARK_2,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: MAIN.FILL,
  },
  retryText: {
    color: FIXED_WHITE,
    fontSize: 15,
    fontWeight: "600",
  },
}));

export default styles;
