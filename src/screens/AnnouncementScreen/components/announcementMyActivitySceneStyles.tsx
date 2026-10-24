import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";

/** 흰 바탕 위 섹션 카드 사이 간격 */
const CARD_GAP = 12;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: WHITE,
    paddingBottom: 24,
  },
  centerFill: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loginBtn: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: MAIN.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: WHITE,
  },
  contentSheet: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: CARD_GAP,
  },
  firstContentSheet: {
    marginTop: CARD_GAP,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: BLACK,
    paddingTop: 16,
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionMore: {
    fontSize: 13,
    color: GRAY.DARK,
    paddingTop: 16,
    marginBottom: 8,
  },
  scheduleEmpty: {
    fontSize: 13,
    color: GRAY.DARK,
    paddingVertical: 12,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  scheduleDay: {
    width: 88,
    fontSize: 13,
    fontWeight: "600",
    color: BLACK,
  },
  scheduleBody: {
    flex: 1,
    gap: 2,
  },
  scheduleKind: {
    fontSize: 11,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  scheduleTitle: {
    fontSize: 14,
    color: BLACK,
  },
  statCard: {
    flexDirection: "row",
    minHeight: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  statColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: GRAY.DARK_1,
  },
  statLabel: {
    fontSize: 13,
    color: GRAY.DARK,
    textAlign: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: BLACK,
  },
});

export default styles;
