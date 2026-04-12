import { StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../color";

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
    backgroundColor: MAIN.DEFAULT,
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
  chatInquiryButton: {
    marginBottom: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
  },
  chatInquiryText: {
    fontSize: 15,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  btnCancel: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EC1313",
  },
});

export default styles;


