import { BLACK, GRAY, MAIN, WHITE, FIXED_WHITE, lightDark } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

export default themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContent: {
    paddingBottom: 28,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM_2,
  },
  nameCell: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "600",
    color: BLACK,
  },
  handleText: {
    fontSize: 11,
    color: GRAY.MEDIUM_100,
  },
  statusCell: {
    minWidth: 40,
    alignItems: "flex-start",
  },
  statusDashText: {
    fontSize: 13,
    color: GRAY.MEDIUM_100,
  },
  statusPill: {
    borderRadius: 11,
    paddingHorizontal: 8,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusPillAccepted: {
    backgroundColor: lightDark("#DCFCE7", "#16301F"),
  },
  statusPillTextAccepted: {
    color: lightDark("#15803D", "#4ADE80"),
  },
  statusPillRejected: {
    backgroundColor: lightDark("#FEE2E2", "#3A1F22"),
  },
  statusPillTextRejected: {
    color: lightDark("#B91C1C", "#F87171"),
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  primaryBtn: {
    backgroundColor: MAIN.FILL,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
}));
