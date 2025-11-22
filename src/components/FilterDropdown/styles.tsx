import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    // flexShrink: 0,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    gap: 8,
    minHeight: 36,
  },
  buttonText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 20,
  },
  iconContainer: {
    flexShrink: 0,
  },
  sortButton: {
    backgroundColor: WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  sortButtonText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  dropdownContainer: {
    backgroundColor: WHITE,
    borderRadius: 8,
    marginHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionSelected: {
    backgroundColor: GRAY.DEFAULT,
  },
  optionText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "400",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
});

export default styles;

