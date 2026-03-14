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
  },
  backButton: {
    padding: 4,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 12,
    height: 44,
    paddingLeft: 12,
    paddingRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingRight: 12,
    fontSize: 16,
    color: "#000",
  },
  searchInputWithTag: {
    paddingLeft: 8,
  },
  clearButton: {
    padding: 8,
    marginRight: 6,
  },
  searchTagChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: MAIN.DEFAULT,
    marginVertical: 6,
    marginRight: 4,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "center",
  },
  searchTagChipText: {
    fontSize: 14,
    color: WHITE,
    fontWeight: "500",
  },
  suggestedSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  suggestedTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 12,
  },
  suggestedTagText: {
    fontSize: 14,
    color: WHITE,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  clearAllText: {
    fontSize: 14,
    color: GRAY.DARK,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK,
  },
  recentTagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recentTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 6,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 8,
  },
  recentTagPress: {
    marginRight: 4,
  },
  recentTagText: {
    fontSize: 14,
    color: "#000",
  },
  recentTagRemove: {
    padding: 4,
  },
  tabView: {
    flex: 1,
  },
  resultsContent: {
    flex: 1,
  },
});

export default styles;
