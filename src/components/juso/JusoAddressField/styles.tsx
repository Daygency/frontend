import { Platform } from "react-native";
import { BLACK, GRAY, MAIN, WHITE, FIXED_WHITE, RED } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { FORM_FIELD_HEIGHT } from "../../forms/FormField/constants";

const styles = themedStyles(() => ({
  wrap: {
    width: "100%",
    gap: 10,
  },
  fieldRow: {
    width: "100%",
    minHeight: FORM_FIELD_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: GRAY.MEDIUM,
    paddingLeft: 15,
    paddingRight: 8,
    gap: 8,
  },
  fieldFocused: {
    borderColor: MAIN.DEFAULT,
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
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    ...Platform.select({
      web: {
        outlineStyle: "none",
        borderWidth: 0,
      },
      default: {},
    }),
  },
  searchButton: {
    minWidth: 56,
    height: 36,
    borderRadius: 8,
    backgroundColor: MAIN.FILL,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  searchButtonText: {
    color: FIXED_WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
  results: {
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: WHITE,
  },
  resultRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
  },
  resultRowPressed: {
    backgroundColor: GRAY.DEFAULT,
  },
  resultAddress: {
    fontSize: 14,
    color: BLACK,
    lineHeight: 19,
  },
}));

export default styles;
