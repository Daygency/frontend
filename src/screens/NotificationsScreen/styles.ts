import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE, lightDark } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  /** FlatList 빈 목록 — 본문을 화면 중앙에 묶음 */
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  centerText: {
    fontSize: 15,
    color: GRAY.DARK,
    textAlign: "center",
    lineHeight: 22,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM_2,
    backgroundColor: WHITE,
  },
  rowUnread: {
    backgroundColor: lightDark("#EEF2F8", "#1C2130"),
  },
  rowRead: {
    backgroundColor: WHITE,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GRAY.DEFAULT_1,
  },
  body: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
  },
  titleUnread: {
    color: MAIN.DEFAULT,
    fontWeight: "600",
  },
  titleRead: {
    color: GRAY.DARK_100,
    fontWeight: "400",
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
  },
  metaUnread: {
    color: GRAY.DARK,
  },
  metaRead: {
    color: GRAY.MEDIUM_100,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MAIN.FILL,
    marginTop: 6,
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: "center",
  },
}));

export default styles;
