import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 6,
  },
  headerSearchMode: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  headerTitleWrap: {
    flex: 1,
    justifyContent: "center",
    marginRight: 12,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSearchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 36,
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 15,
    color: GRAY.DARK_100,
    paddingVertical: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topTabsRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 8,
    paddingTop: 4,
    paddingBottom: 9,
  },
  topTab: {
    backgroundColor: WHITE,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 12,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  topTabSelected: {
    borderColor: MAIN.DEFAULT,
    backgroundColor: MAIN.DEFAULT,
  },
  topTabText: {
    fontSize: 14,
    fontWeight: "400",
    color: MAIN.DEFAULT,
  },
  topTabTextSelected: {
    color: WHITE,
    fontWeight: "500",
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E11D48",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: "700",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default styles;
