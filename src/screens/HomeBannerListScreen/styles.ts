import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../color";

const CARD_GAP = 12;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: CARD_GAP,
  },
  row: {
    gap: CARD_GAP,
  },
  card: {
    backgroundColor: WHITE,
  },
  imageWrap: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: GRAY.DEFAULT,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardTitle: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "#111",
    backgroundColor: WHITE,
  },
  newBadge: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  pastBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  pastBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: WHITE,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK,
    textAlign: "center",
    paddingVertical: 48,
  },
});

export default styles;
