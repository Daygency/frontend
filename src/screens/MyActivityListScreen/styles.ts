import { StyleSheet } from "react-native";
import { WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },
});

export default styles;
