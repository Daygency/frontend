import { Platform, StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
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
});

export default styles;
