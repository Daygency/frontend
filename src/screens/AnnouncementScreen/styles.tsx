import { StyleSheet } from "react-native";
import { WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: WHITE,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 0,
    gap: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 5,
  },
  cardWrapper: {
    marginBottom: 5,
  },
});

export default styles;



