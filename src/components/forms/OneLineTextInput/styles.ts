import { Platform } from "react-native";
import { GRAY, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
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
}));

export default styles;

