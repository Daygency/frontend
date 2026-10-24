import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";

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
    marginBottom: 14,
  },
  list: {
    maxHeight: 360,
  },
  listContent: {
    gap: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 14,
    lineHeight: 21,
    color: GRAY.DARK_2,
    marginRight: 6,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: GRAY.DARK_100,
  },
  confirmBtn: {
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    backgroundColor: MAIN.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnPressed: {
    opacity: 0.85,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: WHITE,
  },
});

export default styles;
