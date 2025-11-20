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
    marginBottom: 3,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 6,
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
    borderRadius: 4,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusTagText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: "400",
  },
  countdownBadge: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  countdownText: {
    fontSize: 12,
    lineHeight: 13,
    color: WHITE,
    fontWeight: "500",
  },
  title: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: "600",
    color: BLACK,
  },
});

export default styles;