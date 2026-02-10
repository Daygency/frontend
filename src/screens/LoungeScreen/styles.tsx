import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabView: {
    flex: 1,
  },
  newsSceneContainer: {
    flex: 1,
  },
  sortFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 9,
    gap: 8,
  },
  sortButton: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 15,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sortButtonActive: {
    backgroundColor: MAIN.DEFAULT,
    borderColor: MAIN.DEFAULT,
  },
  sortButtonText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 20,
  },
  sortButtonTextActive: {
    color: WHITE,
  },
});

export default styles;
