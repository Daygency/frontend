import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  embeddedRoot: {
    backgroundColor: WHITE,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: GRAY.MEDIUM,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: GRAY.DARK,
  },
});

export default styles;

