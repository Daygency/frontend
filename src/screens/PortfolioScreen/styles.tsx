import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

export { MAIN_HOME_TOP_BAR_HEIGHT } from "../../components/MainHomeTopBar/styles";

/** 모집공고 상세와 동일 — 흰 시트 사이 회색 띠 */
export const PORTFOLIO_BODY_BG = "#F2F2F2";
export const PORTFOLIO_SECTION_GAP = 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scroll: {
    flex: 1,
    backgroundColor: PORTFOLIO_BODY_BG,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: PORTFOLIO_BODY_BG,
    paddingBottom: 24,
  },
  contentSheet: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: PORTFOLIO_SECTION_GAP,
  },
  sectionGroupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 12,
  },
  /** contentSheet 안 Section(사진, 받은 후기 등) 공통 */
  sectionStyles: {
    container: {
      marginBottom: 0,
    },
    header: {
      paddingHorizontal: 0,
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      lineHeight: 22,
      letterSpacing: 0,
    },
    content: {
      paddingHorizontal: 0,
      marginTop: 0,
      gap: 0,
    },
  },
  icon: {
    position: "absolute",
    left: 8,
    justifyContent: "center",
  },
  tabView: {
    flex: 1,
  },
  activityBar: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  activityBarText: {
    fontSize: 20,
    fontWeight: "600",
    color: GRAY.DARK_2,
  },
});

export default styles;
