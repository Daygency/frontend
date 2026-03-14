import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  tagsScroll: {
    flex: 1,
    maxHeight: 44,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  selectedTagChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 12,
  },
  selectedTagText: {
    fontSize: 14,
    color: WHITE,
    fontWeight: "500",
  },
  tagCloseIcon: {
    marginLeft: 4,
  },
  unselectedTagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  unselectedTagText: {
    fontSize: 14,
    color: GRAY.DARK,
    fontWeight: "500",
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  sectionTitleSpaced: {
    marginTop: 24,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    color: GRAY.DARK,
    textAlign: "center",
  },
  tabView: {
    flex: 1,
  },
});

export default styles;
