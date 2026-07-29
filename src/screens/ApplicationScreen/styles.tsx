import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  /** 하단 플로팅 — 배경·그림자 없이 버튼만 */
  floatingBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  btnApply: {
    backgroundColor: "#0069FF",
    borderRadius: 16,
    paddingVertical: 16,
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnApplyText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: "600",
    color: WHITE,
  },
  btnApplyDisabled: {
    opacity: 0.45,
  },
  closedHint: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 19,
    color: "#717182",
    textAlign: "center",
  },
  btnCancel: {
    marginBottom: 8,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY.DARK_1,
  },
  btnCancelText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: "600",
    color: "#EC1313",
  },
  loadCareerButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
  },
  loadCareerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  careerList: {
    marginTop: 12,
    gap: 8,
  },
  careerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#FAFAFA",
  },
  careerRowContent: {
    flex: 1,
    marginRight: 8,
  },
  careerDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#111113",
    fontWeight: "500",
  },
  careerPeriod: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#717182",
  },
  careerRemoveButton: {
    padding: 4,
  },
  careerEmptyHint: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: "#717182",
  },
});

export default styles;


