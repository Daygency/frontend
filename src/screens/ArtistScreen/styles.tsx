import { StyleSheet } from "react-native";
import { WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: WHITE,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 13,
    gap: 8,
  },
  scrollContentWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    // 네비게이션 바 높이만큼 paddingBottom 지정해주세요
    paddingBottom: 5,
  },
  cardWrapper: {
    marginBottom: 5,
  },
});

export default styles;



