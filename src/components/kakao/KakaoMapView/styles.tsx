import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
  },
  webview: {
    flex: 1,
    backgroundColor: GRAY.DEFAULT,
  },
  placeholder: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: GRAY.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  placeholderText: {
    fontSize: 13,
    color: GRAY.DARK,
    textAlign: "center",
    lineHeight: 18,
  },
  fallback: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: GRAY.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  fallbackMessage: {
    fontSize: 13,
    color: GRAY.DARK,
    textAlign: "center",
    lineHeight: 18,
  },
  fallbackButton: {
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: MAIN.DEFAULT,
  },
  fallbackButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default styles;
