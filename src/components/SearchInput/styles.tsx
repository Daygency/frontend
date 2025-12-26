import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    backgroundColor: GRAY.DEFAULT,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
  },
  input: {
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 8,
    paddingLeft: 35,
    fontSize: 14,
    letterSpacing: 0.3,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  icon: {
    position: "absolute",
    left: 12,
    height: "100%",
    justifyContent: "center",
  },
});

export default styles;
