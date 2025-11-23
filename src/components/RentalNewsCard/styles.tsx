import { StyleSheet } from "react-native";
import { GRAY, MAIN } from "../../color";

const styles = StyleSheet.create({
  container: {
    gap: 3,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: MAIN.DEFAULT,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueName: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  date: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400",
    color: GRAY.DARK,
  },
});

export default styles;








