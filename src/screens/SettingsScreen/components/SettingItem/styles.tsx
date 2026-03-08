import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  lastItem: {
    marginBottom: 0,
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
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default styles;
