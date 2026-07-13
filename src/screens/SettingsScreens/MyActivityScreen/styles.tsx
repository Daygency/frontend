import { StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  centerFill: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loginBtn: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: MAIN.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: WHITE,
  },
  tabView: {
    flex: 1,
    marginTop: 10,
  },
  postsCommentsContainer: {
    flex: 1,
  },
  postsCommentsScrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sortFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 8,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },
});

export default styles;
