import { StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: WHITE,
  },
  filterWrapper: {
    paddingHorizontal: 12,
    paddingTop: 13,
  },
  filterRow: {
    flexDirection: "row",
    paddingBottom: 9,
    gap: 8,
    alignItems: "center",
  },
  sortTab: {
    backgroundColor: WHITE,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
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
