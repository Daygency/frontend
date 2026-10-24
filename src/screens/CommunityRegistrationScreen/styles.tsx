import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  guidelinesButton: {
    marginLeft: 4,
    padding: 2,
  },
  guidelinesButtonPressed: {
    opacity: 0.5,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: WHITE,
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#0069FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  registerButtonDisabled: {
    backgroundColor: GRAY.MEDIUM_100,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: WHITE,
  },
});

export default styles;
