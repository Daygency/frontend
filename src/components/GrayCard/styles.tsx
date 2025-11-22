import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 10,
    padding: 15,
    gap: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  boardName: {
    fontSize: 14,
    fontWeight: "600",
    color: BLACK,
  },
  spacer: {
    width: 10,
  },
  latestPost: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
    flex: 1,
  },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF0000",
    marginLeft: 4,
  },
});

export default styles;



