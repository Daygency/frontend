import { Platform, StyleSheet } from "react-native";
import { BLACK, GRAY, RED, WHITE } from "../../../../../color";
import { themedStyles } from "../../../../../theme/themedStyles";

const styles = themedStyles(() => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  card: {
    position: "absolute",
    width: 210,
    backgroundColor: WHITE,
    borderRadius: 14,
    paddingVertical: 4,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: GRAY.DARK_2,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: GRAY.MEDIUM,
  },
  optionRowLast: {
    borderBottomWidth: 0,
  },
  optionRowPressed: {
    backgroundColor: GRAY.DEFAULT,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: BLACK,
    fontWeight: "500",
  },
  optionTextDanger: {
    color: RED.DEFAULT,
  },
}));

export default styles;
