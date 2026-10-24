import { WHITE, MAIN, GRAY, BLUE, FIXED_WHITE, lightDark } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

export const styles = themedStyles(() => ({
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
    backgroundColor: MAIN.FILL,
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
    backgroundColor: MAIN.FILL,
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
    color: FIXED_WHITE,
  },
  completeButtonTextDisabled: {
    color: FIXED_WHITE,
    opacity: 0.9,
  },
}));

export const roleSelectionStyles = themedStyles(() => ({
  mainQuestion: {
    fontSize: 22,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    textAlign: "left",
    marginBottom: 12,
  },
  subText: {
    fontSize: 15,
    color: lightDark("#9E9E9E", "#8B8E97"),
    textAlign: "left",
    marginBottom: 50,
  },
  optionsContainer: {
    width: "100%",
    gap: 16,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: lightDark("#E0E0E0", "#2C2D33"),
    gap: 16,
  },
  artistOption: {
    backgroundColor: WHITE,
  },
  plannerOption: {
    backgroundColor: WHITE,
  },
  optionPressed: {
    borderColor: MAIN.DEFAULT,
  },
  textWrap: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 14,
    color: MAIN.DEFAULT,
    lineHeight: 20,
  },
  footerText: {
    fontSize: 14,
    color: MAIN.DEFAULT,
    textAlign: "center",
    marginTop: 40,
    alignSelf: "center",
  },
}));
