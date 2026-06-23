import { StyleSheet } from "react-native";
import { MAIN, RED, WHITE } from "../../../color";

export const MAIN_HOME_TOP_BAR_PADDING_TOP = 6;
export const MAIN_HOME_TOP_BAR_PADDING_BOTTOM = 10;
export const MAIN_HOME_TOP_BAR_HORIZONTAL_PADDING = 17;
export const MAIN_HOME_TOP_BAR_TITLE_SIZE = 22;
export const MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT = 28;
// 상단 타이틀(Logo)과 필터.탭 칩 행 사이 간격
export const FILTER_ROW_PADDING_TOP = 4;
export const MAIN_HOME_TOP_BAR_HEIGHT =
  MAIN_HOME_TOP_BAR_PADDING_TOP +
  MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT +
  MAIN_HOME_TOP_BAR_PADDING_BOTTOM;
// 인라인 검색창 높이 — 채팅.검색 화면 공통 (필터 칩 height 36과 동일)
export const INLINE_SEARCH_BAR_HEIGHT = 36;
// 검색창 열림 시 상단 헤더 세로 패딩 (총 높이 = MAIN_HOME_TOP_BAR_HEIGHT 유지)
export const INLINE_SEARCH_HEADER_PADDING_VERTICAL =
  (MAIN_HOME_TOP_BAR_HEIGHT - INLINE_SEARCH_BAR_HEIGHT) / 2;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
    paddingTop: MAIN_HOME_TOP_BAR_PADDING_TOP,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  icon: {
    position: "absolute",
    left: 8,
    justifyContent: "center",
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
  },
  dotNew: {
    position: "absolute",
    top: -1,
    right: -3,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: RED.DEFAULT,
  },
});

export default styles;
