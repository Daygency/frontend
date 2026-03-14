import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: {
    fontSize: 14,
    color: GRAY.DARK,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: GRAY.DARK,
  },
});

export default styles;
