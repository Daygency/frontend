import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  tag: {
    backgroundColor: WHITE,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 9,
    height: 30,
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
    fontSize: 12,
    fontWeight: "400",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 16,
  },
  tagTextSelected: {
    color: WHITE,
  },
});

export default styles;

