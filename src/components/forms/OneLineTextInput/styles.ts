import { Platform, StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../color";

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 16,
    lineHeight: 20,
    color: GRAY.DARK_100,
    backgroundColor: WHITE,
    minHeight: 48,
  },
});

export default styles;

