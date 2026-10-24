import { BLACK, GRAY, WHITE, FIXED_WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  /** 상단 세그먼트형 탭 */
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    padding: 3,
    borderRadius: 11,
    backgroundColor: GRAY.DEFAULT,
  },
  tab: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: WHITE,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK_2,
  },
  tabTextActive: {
    color: BLACK,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  rowValueText: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: WHITE,
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#0069FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  registerButtonDisabled: {
    backgroundColor: GRAY.MEDIUM_100,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
}));

export default styles;
