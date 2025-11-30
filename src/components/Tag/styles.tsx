import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  tag: {
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  typeTag: {
    backgroundColor: GRAY.DARK_1,
  },
  typeTagText: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  statusTag: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BLACK,
  },
  statusTagText: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  countdownTag: {
    backgroundColor: MAIN.DEFAULT,
  },
  countdownTagText: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.24,
    color: WHITE,
    fontWeight: "500",
  },
});

export default styles;


