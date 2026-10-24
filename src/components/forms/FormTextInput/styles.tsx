import { Platform } from "react-native";
import { BLACK, GRAY, WHITE, RED } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { FORM_FIELD_HEIGHT } from "../../forms/FormField/constants";

const styles = themedStyles(() => ({
  field: {
    width: "100%",
    height: FORM_FIELD_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 15,
  },
  fieldError: {
    borderWidth: 2,
    borderColor: RED.DEFAULT,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    color: BLACK,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    backgroundColor: "transparent",
    ...Platform.select({
      web: {
        outlineStyle: "none",
        borderWidth: 0,
      },
      default: {},
    }),
  },
}));

export default styles;
