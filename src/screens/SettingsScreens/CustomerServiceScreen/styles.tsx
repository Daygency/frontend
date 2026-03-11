import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#575757",
    marginBottom: 12,
    marginTop: 24,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  inquiryButton: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  inquiryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: WHITE,
  },
  historyCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#575757",
    marginBottom: 12,
  },
  filterTags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  historyList: {
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
});

export default styles;
