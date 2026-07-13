import { Platform, StyleSheet } from "react-native";
import { BLACK, GRAY, RED, WHITE } from "../../../color";

export const MAIN_HOME_TOP_BAR_TITLE_SIZE = 21;
export const MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT = 28;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 6,
    minHeight: 44,
  },
  titleArea: {
    flex: 1,
    minWidth: 0,
    marginRight: 4,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  icon: {
    position: "absolute",
    left: 8,
    justifyContent: "center",
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 7,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: RED.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
    includeFontPadding: false,
  },
  titleMenuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flexShrink: 1,
    minHeight: 44,
    justifyContent: "center",
  },
  titleMenuText: {
    fontWeight: "700",
    includeFontPadding: false,
  },
  titleMenuModalRoot: {
    flex: 1,
  },
  titleMenuDropdown: {
    position: "absolute",
    minWidth: 168,
    backgroundColor: WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  titleMenuItemPressed: {
    backgroundColor: GRAY.DEFAULT,
  },
  titleMenuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: BLACK,
  },
  titleMenuItemTextSelected: {
    fontWeight: "700",
    color: BLACK,
  },
});

export default styles;
