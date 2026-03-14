import { StyleSheet, Dimensions } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const CARD_WIDTH = Math.min(Dimensions.get("window").width - 48, 360);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },

  // 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },

  // 년도
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  yearArrow: {
    padding: 4,
  },
  yearText: {
    fontSize: 20,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    minWidth: 80,
    textAlign: "center",
  },

  // 월 그리드 (4열 3행)
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  monthButton: {
    width: "22%",
    flexGrow: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GRAY.DEFAULT_1,
  },
  monthButtonSelected: {
    backgroundColor: MAIN.DEFAULT,
    borderColor: MAIN.DEFAULT,
  },
  monthText: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK_100,
  },
  monthTextSelected: {
    color: WHITE,
    fontWeight: "700",
  },

  // 하단 버튼
  footer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 15,
    fontWeight: "500",
    color: GRAY.DARK,
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: MAIN.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: GRAY.MEDIUM,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "600",
    color: WHITE,
  },
});

export default styles;
