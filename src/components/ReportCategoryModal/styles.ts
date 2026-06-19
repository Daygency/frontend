import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
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
    maxHeight: "78%",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: GRAY.DARK_2,
    marginBottom: 16,
  },
  list: {
    maxHeight: 360,
  },
  loadingWrap: {
    paddingVertical: 32,
    alignItems: "center",
  },
  optionRow: {
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
