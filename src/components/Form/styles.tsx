import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    flexDirection: "row",
    left: 16,
  },
  title: {
    color: GRAY.DARK_100,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
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
});

export default styles;

