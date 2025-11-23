import { StyleSheet } from "react-native";
import { BLACK, GRAY, RED } from "../../color";

const styles = StyleSheet.create({
  container: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 10,
    padding: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  boardName: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: "500",
    color: BLACK,
  },
  spacer: {
    width: 10,
  },
  latestPostWrap: {
    position: "relative",
  },
  latestPost: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: "400",
    color: BLACK,
    flex: 1,
  },
  newDot: {
    position: "absolute",
    top: 3,
    right: -5,
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: RED.DARK,
  },
});

export default styles;








