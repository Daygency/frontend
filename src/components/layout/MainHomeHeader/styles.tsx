import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  tabButton: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "500",
    color: GRAY.DARK,
    includeFontPadding: false,
  },
  tabLabelSelected: {
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  tabLabelDark: {
    color: "rgba(255,255,255,0.55)",
  },
  tabLabelSelectedDark: {
    fontWeight: "600",
    color: WHITE,
  },
  tabIndicator: {
    height: 2,
    marginTop: 6,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 1,
  },
  tabIndicatorDark: {
    backgroundColor: WHITE,
  },
  tabIndicatorPlaceholder: {
    height: 2,
    marginTop: 6,
  },
});

export default styles;
