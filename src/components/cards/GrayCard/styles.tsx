import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../../color";

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
    flexShrink: 1,
  },
  boardNameWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
    marginRight: 8,
    maxWidth: "42%",
  },
  latestPostWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  latestPost: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    color: BLACK,
    flexShrink: 1,
    minWidth: 0,
  },
  itemPressed: {
    opacity: 0.7,
  },
});

export default styles;








