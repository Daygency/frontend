import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: WHITE,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 12,
  },
  input: {
    fontSize: 13,
    color: BLACK,
    maxHeight: 80,
  },
  sendButton: {
    padding: 4,
  },
});

export default styles;
