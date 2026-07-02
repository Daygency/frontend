import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  heroWrap: {
    position: "relative",
    overflow: "hidden",
  },
  timestamp: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.DARK_2,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  image: {
    backgroundColor: WHITE,
  },
});

export default styles;
