import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../color";

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: GRAY.MEDIUM_2,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: "600",
    color: BLACK,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM,
  },
  optionRowPressed: {
    backgroundColor: GRAY.DEFAULT,
  },
  optionText: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: MAIN.DEFAULT,
    fontWeight: "700",
  },
  optionTextDanger: {
    color: RED.DEFAULT,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: GRAY.DARK_2,
    fontWeight: "600",
  },
});

export default styles;
