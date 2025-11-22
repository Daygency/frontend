import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselWrapper: {
    width: "100%",
    position: "relative",
  },
  carouselContainer: {
    flexGrow: 0,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

export default styles;

