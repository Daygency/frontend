import { StyleSheet } from "react-native";
import { GRAY, MAIN, BLACK } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    width: "100%",
    marginTop: 6,
    marginBottom: 8,
  },
  containerFit: {
    width: "100%",
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
    color: BLACK,
  },
  slide: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
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
    backgroundColor: MAIN.FILL,
  },
}));

export default styles;
