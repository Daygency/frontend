import { StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../color";

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
    color: "#111",
    marginBottom: 16,
  },
  body: {
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
    marginBottom: 12,
  },
  meta: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginTop: 8,
  },
  floatingBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
    backgroundColor: "transparent",
  },
  primaryButton: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: WHITE,
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    color: "#666",
  },
});

export default styles;
