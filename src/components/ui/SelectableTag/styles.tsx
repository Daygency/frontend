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
    paddingHorizontal: 12,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  tagSelected: {
    backgroundColor: MAIN.DEFAULT,
    borderColor: MAIN.DEFAULT,
  },
  tagPressed: {
    opacity: 0.5,
  },
  tagText: {
    color: BLACK,
    fontSize: 13,
    fontWeight: "400",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 18,
  },
  tagTextSelected: {
    color: WHITE,
  },
});

export default styles;

