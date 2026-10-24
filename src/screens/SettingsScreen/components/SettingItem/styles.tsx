import { StyleSheet } from "react-native";
import { GRAY } from "../../../../color";
import { themedStyles } from "../../../../theme/themedStyles";

const styles = themedStyles(() => ({
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM_2,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "400",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  value: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
}));

export default styles;
