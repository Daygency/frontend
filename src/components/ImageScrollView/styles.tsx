import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    marginTop: 5,
    paddingHorizontal: 12,
  },
  contentContainer: {
    // alignItems: "center",
    // gap: 5,
    marginHorizontal: 5,
  },
  // imageContainer: {
  //   // height: 183,
  //   width: 339,
  // },
  image: {
    borderRadius: 10,
    height: 193,
    width: "100%",
  },
  imageTitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.3,
    fontWeight: "500",
    color: BLACK,
  },
  imageSpace: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0.3,
    color: GRAY.DARK_2,
  },
  imageDate: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0.3,
    color: GRAY.DARK_2,
  },
});

export default styles;








