import { StyleSheet } from "react-native";
import { WHITE, GRAY } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.DEFAULT,
  },
  backButton: {
    padding: 4,
  },
  content: {
    marginTop: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM_2,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
  optionTextDanger: {
    color: "#EC1313",
  },
});

export default styles;
