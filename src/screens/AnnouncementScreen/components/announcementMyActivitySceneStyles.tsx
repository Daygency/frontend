import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";
import { PORTFOLIO_BODY_BG, PORTFOLIO_SECTION_GAP } from "../../../constants/portfolio";

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: PORTFOLIO_BODY_BG,
    paddingBottom: 24,
  },
  centerFill: {
    flex: 1,
    backgroundColor: PORTFOLIO_BODY_BG,
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
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: PORTFOLIO_SECTION_GAP,
  },
  firstContentSheet: {
    marginTop: PORTFOLIO_SECTION_GAP,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: BLACK,
    paddingTop: 16,
    marginBottom: 8,
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
