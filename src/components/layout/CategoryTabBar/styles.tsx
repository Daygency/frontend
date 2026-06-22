import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: WHITE,
    height: 42,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarItem: {
    width: "auto",
    minWidth: 80,
    paddingHorizontal: 22,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: GRAY.DEFAULT,
    minHeight: 36,
  },
  tabBarItemEven: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: GRAY.DEFAULT,
    minHeight: 36,
  },
  tabLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: GRAY.DARK,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  tabLabelSelected: {
    color: MAIN.DEFAULT,
  },
});

export default styles;
