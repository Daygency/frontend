import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: WHITE,
    height: 48,
    paddingBottom: 6,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarItem: {
    width: "auto",
    minWidth: 80,
    paddingHorizontal: 22,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: GRAY.DEFAULT,
    minHeight: 42,
  },
  tabLabel: {
    fontSize: 14,
    color: GRAY.DARK,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  tabLabelSelected: {
    fontWeight: "600",
  },
});

export default styles;

