import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formSection: {
    gap: 16,
  },
  formField: {
    marginTop: 0,
  },
  contentInputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
    minHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingBottom: 40,
  },
  contentInput: {
    fontSize: 14,
    color: BLACK,
    minHeight: 80,
  },
  imageAttachButton: {
    position: "absolute",
    bottom: 12,
    left: 14,
  },
  guidelinesSection: {
    marginTop: 24,
    gap: 8,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  guidelineBullet: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginRight: 6,
  },
  guidelineText: {
    flex: 1,
    fontSize: 12,
    color: GRAY.DARK_2,
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: WHITE,
  },
  anonymousToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: GRAY.DARK_2,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#0057D9",
    borderColor: "#0057D9",
  },
  anonymousText: {
    fontSize: 14,
    color: GRAY.DARK_100,
  },
  registerButton: {
    flex: 1,
    maxWidth: 200,
    backgroundColor: "#0057D9",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonDisabled: {
    backgroundColor: GRAY.DARK_1,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: WHITE,
  },
});

export default styles;
