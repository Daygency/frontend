import { StyleSheet } from "react-native";
import { WHITE, MAIN, GRAY, BLUE } from "../../../color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  sliderWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  sliderTrack: {
    flexDirection: "row",
    flex: 1,
    alignItems: "stretch",
  },
  slidePage: {
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "stretch",
  },
  formPage: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  formScroll: {
    flexGrow: 1,
  },
  formContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  headerRow: {
    position: "relative",
  },
  backButton: {
    position: "absolute",
    right: 16,
    top: 8,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  agreementRadioBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: GRAY.DARK_2,
    backgroundColor: "transparent",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  agreementRadioBoxChecked: {
    borderColor: MAIN.DEFAULT,
    backgroundColor: MAIN.DEFAULT,
  },
  agreementCheckmark: {
    width: 7,
    height: 11,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: WHITE,
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -3.5,
    marginTop: -6.5,
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
  agreementItemUnchecked: {
    color: GRAY.DARK_2,
  },
  agreementOptional: {
    color: GRAY.DARK_2,
  },
  buttonContainer: {
    flexShrink: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
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
