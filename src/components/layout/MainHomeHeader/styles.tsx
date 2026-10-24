import { GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

// 인라인 모드에서는 밑줄을 절대 위치로 텍스트 바로 아래에 띄워서, 밑줄 때문에
// 상단바 전체 높이가 늘어나 다른 요소(태그 필터 줄 등)가 밀려 내려가는 걸 막는다.
const INLINE_TAB_LABEL_SIZE = 18;
const INLINE_TAB_LABEL_LINE_HEIGHT = 24;
const INLINE_INDICATOR_TOP = INLINE_TAB_LABEL_LINE_HEIGHT + 6;

const styles = themedStyles(() => ({
  container: {
    width: "100%",
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  containerDense: {
    paddingBottom: 4,
  },
  containerInline: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: "center",
    gap: 14,
  },
  tabButton: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "500",
    color: GRAY.DARK,
    includeFontPadding: false,
  },
  tabLabelInline: {
    fontSize: INLINE_TAB_LABEL_SIZE,
    lineHeight: INLINE_TAB_LABEL_LINE_HEIGHT,
  },
  tabLabelSelected: {
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  tabLabelDark: {
    color: "rgba(255,255,255,0.55)",
  },
  tabLabelSelectedDark: {
    fontWeight: "600",
    color: FIXED_WHITE,
  },
  tabIndicator: {
    height: 2,
    marginTop: 6,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 1,
  },
  tabIndicatorInline: {
    position: "absolute",
    top: INLINE_INDICATOR_TOP,
    marginTop: 0,
  },
  tabIndicatorDark: {
    backgroundColor: FIXED_WHITE,
  },
  tabIndicatorPlaceholder: {
    height: 2,
    marginTop: 6,
  },
}));

export default styles;
