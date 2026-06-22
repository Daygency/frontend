import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";
import {
  INLINE_SEARCH_BAR_HEIGHT,
  MAIN_HOME_TOP_BAR_HEIGHT,
  MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
  MAIN_HOME_TOP_BAR_PADDING_TOP,
} from "../../components/MainHomeTopBar/styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: MAIN_HOME_TOP_BAR_HEIGHT,
    paddingHorizontal: 12,
    paddingTop: MAIN_HOME_TOP_BAR_PADDING_TOP,
    paddingBottom: MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 10,
    height: INLINE_SEARCH_BAR_HEIGHT,
    paddingHorizontal: 12,
    minWidth: 0,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    color: "#000",
    paddingVertical: 0,
  },
  searchInputWithTag: {
    paddingLeft: 6,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  searchTagChip: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    paddingHorizontal: 12,
    backgroundColor: MAIN.DEFAULT,
    marginRight: 4,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "center",
  },
  searchTagChipText: {
    fontSize: 14,
    color: WHITE,
    fontWeight: "500",
  },
  suggestedScroll: {
    flexGrow: 0,
  },
  suggestedSection: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  suggestedTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    flexShrink: 0,
  },
  suggestedTagActive: {
    backgroundColor: MAIN.DEFAULT,
    borderColor: MAIN.DEFAULT,
  },
  suggestedTagText: {
    fontSize: 14,
    color: MAIN.DEFAULT,
    fontWeight: "500",
  },
  suggestedTagTextActive: {
    color: WHITE,
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
