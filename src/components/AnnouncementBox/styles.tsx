import { StyleSheet } from "react-native";
import { BLACK, MAIN } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    backgroundColor: MAIN.LIGHT,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: BLACK,
    fontWeight: "700",
    lineHeight: 28,
  },
});

export default styles;
