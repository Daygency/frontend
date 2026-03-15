import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 19,
    lineHeight: 27,
    letterSpacing: -0.32,
    fontWeight: "600",
  },
  moreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  more: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: 400,
    color: GRAY.DARK,
  },
  moreIcon: {},
  content: {
    marginTop: 5,
    gap: 5,
    paddingHorizontal: 20,
  },
});

export default styles;

