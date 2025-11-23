import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  dropdown: {
    height: 20,
    backgroundColor: "transparent",
  },
  placeholderStyle: {
    fontSize: 14,
    color: GRAY.MEDIUM_100,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: GRAY.DARK_100,
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: GRAY.MEDIUM_100,
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
    borderRadius: 10,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
  },
});

export default styles;

