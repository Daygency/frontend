import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 19,
    paddingHorizontal: 27,
    backgroundColor: MAIN.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.DARK_1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 7,
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    color: BLACK,
    fontWeight: "500",
  },
});

export default styles;
