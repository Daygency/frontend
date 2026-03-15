import { StyleSheet } from "react-native";
import { BLACK, GRAY, RED } from "../../color";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM_2,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  boardName: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: BLACK,
    flexShrink: 0,
    marginRight: 8,
  },
  latestPostWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  latestPost: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    color: BLACK,
    flex: 1,
  },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RED.DARK,
    flexShrink: 0,
  },
});

export default styles;








