import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  shadow: {
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default styles;

