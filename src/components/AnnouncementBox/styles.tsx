import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

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
  priceLine: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: GRAY.DARK_2,
    fontWeight: "500",
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
  typeTag: {
    backgroundColor: GRAY.DARK_1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeTagText: {
    fontSize: 12,
    lineHeight: 13,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  statusTag: {
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusTagText: {
    fontSize: 12,
    lineHeight: 13,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  dateText: {
    fontSize: 13,
    color: GRAY.DARK_2,
    fontWeight: "400",
  },
});

export default styles;
