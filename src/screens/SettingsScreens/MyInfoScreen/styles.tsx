import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    padding: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: GRAY.MEDIUM_100,
  },
});

export default styles;
