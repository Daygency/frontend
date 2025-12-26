import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../color";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GRAY.MEDIUM,
  },
  dotsContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  profileNameContainer: {
    position: "absolute",
    left: 40,
    top: 0,
  },
  contentContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  content: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
  },
  tagContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
});

export default styles;
