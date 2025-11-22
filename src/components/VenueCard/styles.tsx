import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  bookmarkContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  bookmarkCount: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
    marginTop: 4,
  },
  imageSection: {
    marginVertical: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "400",
    color: BLACK,
  },
});

export default styles;



