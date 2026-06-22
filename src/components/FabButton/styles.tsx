import { Platform, StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

export const MENU_ICON_SIZE = 20;
export const MENU_SLIDE_DISTANCE = 36;
export const MENU_CLOSE_SLIDE_DISTANCE = 52;

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  menuContainer: {
    position: "absolute",
    right: 20,
    alignSelf: "flex-end",
    minWidth: 176,
    backgroundColor: WHITE,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexShrink: 0,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM,
  },
  menuIconSlot: {
    width: MENU_ICON_SIZE,
    height: MENU_ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  menuIcon: {
    width: MENU_ICON_SIZE,
    height: MENU_ICON_SIZE,
    maxWidth: MENU_ICON_SIZE,
    maxHeight: MENU_ICON_SIZE,
    resizeMode: "contain",
    ...Platform.select({
      web: {
        objectFit: "contain",
      },
    }),
  },
  menuItemText: {
    color: BLACK,
    fontSize: 15,
    fontWeight: "500",
    flexShrink: 1,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: MAIN.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fabOpen: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
});

export default styles;
