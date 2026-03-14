import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0.3,
    color: BLACK,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    color: GRAY.DARK_2,
    fontWeight: "400",
  },
});

export default styles;
