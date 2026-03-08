import { Platform, StyleSheet } from "react-native";
import { RED, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: RED.DEFAULT,
    textAlign: "center",
    marginBottom: 20,
  },
  bulletList: {
    marginBottom: 20,
  },
  bulletItem: {
    fontSize: 14,
    color: "#000",
    lineHeight: 22,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: WHITE,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: RED.DEFAULT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  deleteButtonDisabled: {
    backgroundColor: "#EDEBEB",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: WHITE,
  },
  deleteButtonTextDisabled: {
    color: "#888",
  },
});

export default styles;
