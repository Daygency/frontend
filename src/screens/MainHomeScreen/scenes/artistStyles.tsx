import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";
import { FILTER_ROW_PADDING_TOP } from "../../../components/layout/MainHomeTopBar/styles";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: WHITE,
  },
  filterWrapper: {
    paddingHorizontal: 12,
    paddingTop: FILTER_ROW_PADDING_TOP,
  },
  filterRow: {
    flexDirection: "row",
    paddingBottom: 9,
    gap: 8,
    alignItems: "center",
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
    color: "#000000",
    fontSize: 14,
    fontWeight: "400",
  },
  tagTextSelected: {
    color: WHITE,
    fontWeight: "500",
  },
  tagSection: {
    marginTop: 10,
    paddingBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  scrollContentWrapper: {
    flex: 1,
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
});

export default styles;

