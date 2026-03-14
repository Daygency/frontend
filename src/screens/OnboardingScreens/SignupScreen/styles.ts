import { StyleSheet } from "react-native";
import { WHITE, MAIN, GRAY, BLUE } from "../../../color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  heading1: {
    fontSize: 22,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    marginBottom: 4,
  },
  heading2: {
    fontSize: 22,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: MAIN.DEFAULT,
    marginBottom: 8,
  },
  labelFocused: {
    color: BLUE.DEFAULT,
  },
  input: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 20,
    color: MAIN.DEFAULT,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: BLUE.DEFAULT,
    backgroundColor: WHITE,
  },
  agreementSection: {
    marginTop: 8,
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  agreementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  agreementDesc: {
    fontSize: 13,
    color: GRAY.DARK_2,
    lineHeight: 20,
    marginBottom: 20,
    marginLeft: 32,
  },
  agreementItem: {
    fontSize: 15,
    color: MAIN.DEFAULT,
  },
  agreementOptional: {
    color: GRAY.DARK_2,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 34,
  },
  completeButton: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonDisabled: {
    backgroundColor: GRAY.MEDIUM_2,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: WHITE,
  },
  completeButtonTextDisabled: {
    color: WHITE,
    opacity: 0.9,
  },
});
