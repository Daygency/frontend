import { Platform, StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: GRAY.MEDIUM,
    overflow: "hidden",
  },
  shadow: {
    shadowColor: MAIN.DEFAULT,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  item: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemHighlighted: {
    backgroundColor: GRAY.DEFAULT,
  },
  itemContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK_100,
  },
  chevron: {
    marginLeft: 8,
  },
});

export default styles;
