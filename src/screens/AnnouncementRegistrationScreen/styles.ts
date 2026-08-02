import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: MAIN.DEFAULT,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK_100,
  },
  tabTextActive: {
    color: MAIN.DEFAULT,
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
  scheduleLocationBox: {
    gap: 16,
  },
  scheduleField: {
    gap: 8,
  },
  scheduleErrorText: {
    fontSize: 12,
    lineHeight: 16,
    color: RED.DEFAULT,
  },
  deadlineHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 2,
  },
  toggleText: {
    fontSize: 14,
    color: BLACK,
  },
  datePickerFieldDisabled: {
    backgroundColor: GRAY.DEFAULT,
    opacity: 0.7,
  },
  datePickerTextDisabled: {
    color: GRAY.DARK_2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickButtonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  quickButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: GRAY.DEFAULT,
  },
  quickButtonText: {
    fontSize: 12,
    color: GRAY.DARK_100,
  },
  quickButtonActive: {
    backgroundColor: MAIN.DEFAULT,
  },
  datePickerField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 46,
  },
  datePickerTextPlaceholder: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  datePickerTouchable: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 46,
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: 14,
    color: BLACK,
  },
  datePickerConfirmButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 8,
  },
  datePickerConfirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: WHITE,
  },
  datePickerPlaceholder: {
    color: GRAY.DARK_2,
  },
  contentInputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
    minHeight: 140,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingBottom: 50,
  },
  inputErrorBorder: {
    borderColor: "#EC1313",
    borderWidth: 2,
  },
  contentInput: {
    fontSize: 14,
    color: BLACK,
    minHeight: 80,
  },
  contentNote: {
    position: "absolute",
    bottom: 12,
    left: 14,
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  /** 본문 입력란 외(파일·첨부 안내 등) — absolute 금지, 겹침 방지 */
  fileHelperNote: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.DARK_2,
    marginTop: 8,
  },
  fileOptions: {
    gap: 8,
  },
  fileOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
  },
  fileOptionText: {
    flex: 1,
    fontSize: 14,
    color: BLACK,
  },
  applicationFormTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  requiredMark: {
    color: "#BE0A0A",
  },
  applicationFormDescription: {
    fontSize: 14,
    color: GRAY.DARK_2,
    marginTop: 4,
    marginBottom: 16,
  },
  formFieldHeader: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  applicationFormItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: GRAY.DARK_1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: MAIN.DEFAULT,
    borderColor: MAIN.DEFAULT,
  },
  applicationFormLabel: {
    flex: 1,
    fontSize: 14,
    color: BLACK,
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: GRAY.DARK_1,
    alignItems: "center",
    justifyContent: "center",
  },
  radioChecked: {
    borderColor: MAIN.DEFAULT,
    borderWidth: 2,
  },
  radioError: {
    borderColor: "#EC1313",
    borderWidth: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MAIN.DEFAULT,
  },
  confirmText: {
    flex: 1,
    fontSize: 14,
    color: BLACK,
  },
  imageAttachButton: {
    position: "absolute",
    bottom: 12,
    left: 14,
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
