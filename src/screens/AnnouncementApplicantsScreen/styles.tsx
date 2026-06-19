import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const ORANGE = "#F97316";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 12,
  },
  applicantCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 14,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  statusTag: {
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    maxWidth: "42%",
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTagSubmitted: {
    backgroundColor: "#F3F4F6",
  },
  statusTagTextSubmitted: {
    color: "#4B5563",
  },
  statusTagAccepted: {
    backgroundColor: "#DCFCE7",
  },
  statusTagTextAccepted: {
    color: "#15803D",
  },
  statusTagRejected: {
    backgroundColor: "#FEE2E2",
  },
  statusTagTextRejected: {
    color: "#B91C1C",
  },
  statusTagReview: {
    backgroundColor: "#FFEDD5",
  },
  statusTagTextReview: {
    color: ORANGE,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GRAY.MEDIUM_2,
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  previewText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: MAIN.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: WHITE,
  },
});
