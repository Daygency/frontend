import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";

const styles = StyleSheet.create({
  tag: {
    ...SMOOTH_CORNERS,
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 15,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  tagSelected: {
    backgroundColor: MAIN.DEFAULT,
    borderColor: MAIN.DEFAULT,
  },
  tagText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 20,
  },
  tagTextSelected: {
    color: WHITE,
  },
});

export default styles;

