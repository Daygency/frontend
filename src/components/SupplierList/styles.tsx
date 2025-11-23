import { StyleSheet } from "react-native";
import { MAIN } from "../../color";

const styles = StyleSheet.create({
  conatiner: {
    flexGrow: 0,
    marginBottom: 17,
  },
  contentContainer: {
    justifyContent: "center",
    gap: 13,
    paddingHorizontal: 16,
  },
  itemContainer: {
    alignItems: "center",
  },
  icon: {
    backgroundColor: MAIN.DEFAULT,
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  title: { lineHeight: 16, fontSize: 11, fontWeight: "400" },
});

export default styles;





