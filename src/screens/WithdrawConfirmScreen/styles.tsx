import { RED, WHITE, FIXED_WHITE, BLACK, GRAY } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: RED.DEFAULT,
    textAlign: "center",
    marginBottom: 20,
  },
  bulletList: {
    marginBottom: 20,
  },
  bulletItem: {
    fontSize: 14,
    color: BLACK,
    lineHeight: 22,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  /** 공고 상세 `floatingBottomBar`와 동일 — 배경·그림자 없이 버튼만 */
  floatingBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
    backgroundColor: "transparent",
  },
  checkboxLabel: {
    fontSize: 14,
    color: BLACK,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: RED.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonDisabled: {
    backgroundColor: GRAY.MEDIUM,
  },
  deleteButtonText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
  deleteButtonTextDisabled: {
    color: GRAY.DARK_2,
  },
}));

export default styles;
