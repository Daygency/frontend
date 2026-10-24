import { WHITE, FIXED_WHITE } from "../../../../color";
import { themedStyles } from "../../../../theme/themedStyles";

const HORIZONTAL_GAP = 12;

const styles = themedStyles(() => ({
  list: {
    flex: 1,
    backgroundColor: "transparent",
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_GAP,
    paddingTop: 6,
    paddingBottom: 120,
    gap: HORIZONTAL_GAP,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  listContentCentered: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  heroWrap: {
    marginBottom: HORIZONTAL_GAP,
  },
  gridRow: {
    gap: HORIZONTAL_GAP,
    marginBottom: HORIZONTAL_GAP,
  },
  gridCard: {
    backgroundColor: "transparent",
  },
  imageWrap: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  pastBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  pastBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
}));

export default styles;
