import { StyleSheet } from "react-native";
import { WHITE, GRAY, BLACK, RED } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
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
    color: BLACK,
  },
  optionTextDanger: {
    color: RED.DEFAULT,
  },
}));

export default styles;
