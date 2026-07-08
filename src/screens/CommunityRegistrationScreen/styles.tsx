import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";
import {
  FORM_FIELD_FONT_SIZE,
  FORM_FIELD_HEIGHT,
} from "../../components/forms/FormField/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  categoryTrigger: {
    width: "100%",
    height: FORM_FIELD_HEIGHT,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryTriggerText: {
    fontSize: FORM_FIELD_FONT_SIZE,
    color: GRAY.DARK_100,
  },
  categoryTriggerPlaceholder: {
    fontSize: FORM_FIELD_FONT_SIZE,
    color: GRAY.MEDIUM_100,
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
    paddingTop: 4,
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
    backgroundColor: "#0069FF",
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: WHITE,
  },
});

export default styles;
