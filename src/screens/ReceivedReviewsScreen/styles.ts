import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  emptyContainer: {
    paddingTop: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  headerButton: {
    marginRight: 12,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK_2,
  },
});

export default styles;
