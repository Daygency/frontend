import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
    flexDirection: "row",
    alignItems: "center",
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  statusAnswered: {
    backgroundColor: GRAY.DEFAULT_1,
  },
  statusUnanswered: {
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextAnswered: {
    color: GRAY.DARK_2,
  },
  statusTextUnanswered: {
    color: "#E65100",
  },
  date: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  content: {
    fontSize: 14,
    color: "#575757",
    lineHeight: 20,
  },
});

export default styles;
