import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: GRAY.DARK_2,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
    color: BLACK,
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 15,
    color: GRAY.DARK_2,
    textAlign: "center",
  },
  root: {
    flex: 1,
    backgroundColor: WHITE,
  },
  actionBar: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    backgroundColor: WHITE,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC2626",
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: MAIN.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: WHITE,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
});
