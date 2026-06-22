import { StyleSheet } from "react-native";
import { GRAY, MAIN } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 6,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 19,
    lineHeight: 27,
    letterSpacing: -0.32,
    fontWeight: "600",
    color: "#000",
  },
  slide: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: GRAY.DEFAULT,
  },
  slideImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  slidePlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  pagination: {
    gap: 6,
    marginTop: 10,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GRAY.DARK_1,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: MAIN.DEFAULT,
  },
});

export default styles;
