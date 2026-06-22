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
  datePickerField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  datePickerText: {
    fontSize: 14,
    color: BLACK,
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
  thumbnailBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderStyle: "dashed",
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  thumbnailImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    backgroundColor: GRAY.MEDIUM,
  },
  thumbnailPlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  thumbnailPlaceholderText: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  imageUploadBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  imageUploadText: {
    fontSize: 14,
    color: GRAY.DARK_2,
    marginTop: 8,
  },
  inputErrorBorder: {
    borderColor: "#E53935",
  },
  datetimeRow: {
    flexDirection: "row",
    gap: 12,
  },
  endDateToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    color: BLACK,
  },
  charCount: {
    position: "absolute",
    bottom: 12,
    right: 14,
    fontSize: 12,
    color: GRAY.DARK_2,
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
