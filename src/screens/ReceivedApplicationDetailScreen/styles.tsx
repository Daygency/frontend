import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../color";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  detailInner: {
    flex: 1,
  },
  detailScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 30,
  },
  applicantChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 132,
    marginTop: 2,
  },
  applicantName: {
    fontSize: 12,
    lineHeight: 16,
    color: BLACK,
    fontWeight: "500",
    flexShrink: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  majorText: {
    fontSize: 13,
    lineHeight: 18,
    color: BLACK,
    fontWeight: "500",
    flexShrink: 1,
  },
  sectionBlock: {
    marginBottom: 28,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 24,
    marginBottom: 12,
  },
  fieldRow: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: GRAY.DARK_2,
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    lineHeight: 24,
    color: BLACK,
  },
  multilineValue: {
    fontSize: 16,
    lineHeight: 24,
    color: BLACK,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: WHITE,
  },
  emptyText: {
    fontSize: 15,
    color: GRAY.DARK_2,
    textAlign: "center",
  },
  floatingBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: GRAY.MEDIUM_2,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: RED.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectBtnText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: RED.DEFAULT,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: MAIN.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtnText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: WHITE,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
});
