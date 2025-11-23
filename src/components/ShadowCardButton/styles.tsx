import { Platform, StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  shadow: {
    shadowColor: MAIN.DEFAULT,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 10 },
    }),
  },
});

export default styles;







