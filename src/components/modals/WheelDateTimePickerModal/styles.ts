import { StyleSheet } from "react-native";

export const WHEEL_PICKER_SHEET_BG = "#1C1C1E";
export const WHEEL_PICKER_BUTTON_BG = "#3A3A3C";
export const WHEEL_PICKER_TEXT = "#FFFFFF";
export const WHEEL_PICKER_SUBTEXT = "#A1A1A6";
export const WHEEL_PICKER_HIGHLIGHT = "rgba(255, 255, 255, 0.12)";

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: WHEEL_PICKER_SHEET_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: WHEEL_PICKER_TEXT,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: WHEEL_PICKER_SUBTEXT,
    textAlign: "center",
    marginBottom: 8,
  },
  pickerWrap: {
    position: "relative",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  pickerHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    marginTop: -20,
    height: 40,
    borderRadius: 10,
    backgroundColor: WHEEL_PICKER_HIGHLIGHT,
  },
  picker: {
    height: 216,
    width: "100%",
  },
  confirmButton: {
    backgroundColor: WHEEL_PICKER_BUTTON_BG,
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: WHEEL_PICKER_TEXT,
    textAlign: "center",
  },
});

export default styles;
