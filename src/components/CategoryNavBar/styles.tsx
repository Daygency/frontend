import { StyleSheet } from "react-native";
import { GRAY, MAIN } from "../../color";

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexGrow: 0,
    paddingBottom: 6,
  },
  contentContainer: {
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: GRAY.DEFAULT,
    minHeight: 42,
  },
  buttonSelected: {
    borderBottomWidth: 1,
    borderColor: MAIN.DEFAULT,
  },
  text: {
    fontSize: 14,
    color: "#717182",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textSelected: {
    fontWeight: "600",
  },
});

export default styles;

