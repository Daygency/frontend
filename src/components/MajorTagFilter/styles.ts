import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  /** 모집공고 상단 필터 — 정렬 탭과 동일한 비선택(연회색) 톤 */
  triggerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 12,
    height: 36,
    overflow: "hidden",
  },
  triggerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  triggerText: {
    color: MAIN.DEFAULT,
    fontSize: 14,
    fontWeight: "500",
  },
  triggerIcon: {
    marginLeft: 6,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: GRAY.DEFAULT,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  tagSelected: {
    backgroundColor: MAIN.DEFAULT,
    borderColor: MAIN.DEFAULT,
  },
  tagText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "400",
  },
  tagTextSelected: {
    color: WHITE,
    fontWeight: "500",
  },
});
