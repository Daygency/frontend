import { StyleSheet } from "react-native";
import { RED } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
  },
  dotNew: {
    position: "absolute",
    top: -1,
    right: -3,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: RED.DEFAULT,
  }
});

export default styles;








