import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: WHITE,
  },
  filterWrapper: {
    paddingTop: 4,
  },
  filterChipRow: {
    paddingBottom: 8,
  },
  filterChipRowContent: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 12,
    height: 36,
    gap: 4,
  },
  filterChipActive: {
    borderColor: MAIN.DEFAULT,
    backgroundColor: MAIN.DEFAULT,
  },
  filterChipText: {
    color: MAIN.DEFAULT,
    fontSize: 14,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: WHITE,
  },
  sortTabRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 9,
    gap: 8,
    alignItems: "center",
  },
  /** 비선택 탭 */
  sortTab: {
    backgroundColor: WHITE,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 12,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  sortTabActive: {
    borderColor: MAIN.DEFAULT,
    backgroundColor: MAIN.DEFAULT,
  },
  sortTabText: {
    color: MAIN.DEFAULT,
    fontSize: 14,
    fontWeight: "400",
  },
  sortTabTextActive: {
    color: WHITE,
    fontWeight: "500",
  },
  scrollContentWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    marginTop: 4,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    marginTop: 4,
    paddingHorizontal: 12,
    // 네비게이션 바 높이만큼 paddingBottom 지정해주세요
    paddingBottom: 5,
  },
  cardWrapper: {
    marginBottom: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 15,
    color: "#999",
  },
});

export default styles;
