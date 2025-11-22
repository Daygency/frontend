import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingLeft: 40,
    fontSize: 14,
  },
  icon: {
    position: "absolute",
    left: 8,
    height: "100%",
    justifyContent: "center",
  },
});

export default styles;



