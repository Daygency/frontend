import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../color";
import {
  FORM_FIELD_FONT_SIZE,
  FORM_FIELD_HEIGHT,
} from "../../forms/FormField/constants";

const styles = StyleSheet.create({
  field: {
    width: "100%",
    height: FORM_FIELD_HEIGHT,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 15,
    justifyContent: "center",
    zIndex: 10,
  },
  fieldError: {
    borderWidth: 2,
    borderColor: "#EC1313",
  },
  dropdown: {
    width: "100%",
    minHeight: FORM_FIELD_HEIGHT - 2,
    backgroundColor: "transparent",
  },
  placeholderStyle: {
    fontSize: FORM_FIELD_FONT_SIZE,
    color: GRAY.MEDIUM_100,
  },
  selectedTextStyle: {
    flex: 1,
    fontSize: FORM_FIELD_FONT_SIZE,
    color: GRAY.DARK_100,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 8,
  },
  itemTextStyle: {
    fontSize: 14,
    color: GRAY.DARK_100,
  },
  containerStyle: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
    shadowOpacity: 0,
    elevation: 0,
  },
  itemContainerStyle: {
    borderBottomWidth: 0,
  },
});

export default styles;
