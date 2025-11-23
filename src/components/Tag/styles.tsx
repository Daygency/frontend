import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeTag: {
    backgroundColor: GRAY.DEFAULT,
  },
  typeTagText: {
    fontSize: 12,
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
    color: BLACK,
    fontWeight: "400",
  },
  countdownTag: {
    backgroundColor: MAIN.DEFAULT,
  },
  countdownTagText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "500",
  },
});

export default styles;

