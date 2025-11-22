import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  typeTag: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeTagText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: "400",
  },
  statusTag: {
    backgroundColor: WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BLACK,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusTagText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: "400",
  },
  countdownBadge: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countdownText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "600",
    lineHeight: 22,
  },
});

export default styles;