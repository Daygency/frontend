import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {},
  titleContainer: { flexDirection: "row", left: 16 },
  title: {
    color: GRAY.DARK_100,
    fontWeight: "700",
    lineHeight: 20,
  },
  example: {
    marginTop: 4,
    marginLeft: 16,
    fontWeight: "400",
    fontSize: 14,
    color: GRAY.MEDIUM_100,
  },
  asterisk: {
    left: 4,
  },
  childrenContainer: {
    marginTop: 8,
    gap: 8,
  },
});

export default styles;

