import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingTop: 100,
  },
  text: {
    fontSize: 16,
    color: GRAY.DARK,
    fontWeight: "400",
  },
});

export default styles;

