import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../../color";

const styles = StyleSheet.create({
  tag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  typeTag: {
    backgroundColor: "#EDF2F7",
  },
  typeTagText: {
    fontSize: 11,
    color: "#4A5568",
    fontWeight: "500",
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
  reactionTag: {
    backgroundColor: GRAY.MEDIUM,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reactionTagText: {
    fontSize: 13,
    color: GRAY.DARK_100,
    fontWeight: "400",
  },
});

export default styles;


