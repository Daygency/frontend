import { StyleSheet } from "react-native";
import { BLACK, BLUE, GRAY, MAIN } from "../../color";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM_2,
  },
  header: {
    marginHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    marginTop: 5,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: MAIN.DEFAULT,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  bookmarkContainer: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  bookmarkCount: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: "400",
    color: BLACK,
    marginTop: 1,
    opacity: 0.6,
  },
  imageSection: {
    marginTop: 5,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: 12,
    marginBottom: 10,
    marginLeft: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: BLUE.LIGHT_1,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
    color: BLACK,
  },
});

export default styles;



