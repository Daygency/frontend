import { StyleSheet } from "react-native";
import { BLACK, GRAY, RED, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContent: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: WHITE,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GRAY.DEFAULT,
  },
  fileText: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: 15,
    lineHeight: 20,
    color: BLACK,
    fontWeight: "600",
  },
  fileMeta: {
    marginTop: 3,
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GRAY.MEDIUM,
    marginLeft: 74,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: GRAY.DARK_2,
    textAlign: "center",
  },
  footerButton: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: GRAY.MEDIUM,
  },
  footerButtonText: {
    fontSize: 14,
    color: RED.DEFAULT,
    fontWeight: "700",
  },
});

export default styles;
