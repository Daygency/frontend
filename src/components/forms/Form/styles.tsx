import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../../color";

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    flexDirection: "row",
    left: 16,
  },
  titleContainerSection: {
    left: 0,
  },
  titleContainerSub: {
    left: 0,
  },
  title: {
    color: GRAY.DARK_100,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  titleSection: {
    color: BLACK,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  titleSub: {
    color: GRAY.DARK_2,
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  titleError: {
    color: "#EC1313",
  },
  example: {
    marginTop: 4,
    marginLeft: 16,
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
    color: GRAY.MEDIUM_100,
  },
  asterisk: {
    left: 3,
  },
  childrenContainer: {
    marginTop: 8,
    gap: 5,
  },
  childrenContainerSub: {
    marginTop: 6,
    gap: 4,
  },
});

export default styles;

