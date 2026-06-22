import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../color";
import { FILTER_ROW_PADDING_TOP } from "../../../components/layout/MainHomeTopBar/styles";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: WHITE,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: FILTER_ROW_PADDING_TOP,
    paddingBottom: 9,
    gap: 8,
  },
  scrollContentWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  cardWrapper: {
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM_2,
  },
});

export default styles;

