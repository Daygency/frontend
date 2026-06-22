import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";
import {
  FILTER_ROW_PADDING_TOP,
  INLINE_SEARCH_BAR_HEIGHT,
  INLINE_SEARCH_HEADER_PADDING_VERTICAL,
  MAIN_HOME_TOP_BAR_HEIGHT,
  MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
  MAIN_HOME_TOP_BAR_PADDING_TOP,
} from "../../../components/layout/MainHomeTopBar/styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    width: "100%",
    height: MAIN_HOME_TOP_BAR_HEIGHT,
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
    paddingTop: MAIN_HOME_TOP_BAR_PADDING_TOP,
  },
  headerSearchMode: {
    paddingTop: INLINE_SEARCH_HEADER_PADDING_VERTICAL,
    paddingBottom: INLINE_SEARCH_HEADER_PADDING_VERTICAL,
  },
  headerTitleWrap: {
    flex: 1,
    justifyContent: "center",
    marginRight: 12,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
  },
  headerSearchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: INLINE_SEARCH_BAR_HEIGHT,
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
    paddingTop: FILTER_ROW_PADDING_TOP,
    paddingBottom: 9,
  },
  topTab: {
    backgroundColor: GRAY.DEFAULT_1,
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
