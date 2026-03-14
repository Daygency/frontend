import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: MAIN.DEFAULT,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK_100,
  },
  tabTextActive: {
    color: WHITE,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
    padding: 16,
    gap: 16,
  },
  scheduleField: {
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
  fileOptions: {
    gap: 8,
  },
  fileOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
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
  formFieldHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  formFieldHeader: {
    fontSize: 12,
    color: GRAY.DARK_2,
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
  formToggle: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: WHITE,
  },
  registerButton: {
    alignSelf: "center",
    minWidth: 200,
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
