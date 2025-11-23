import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: GRAY.MEDIUM,
    borderWidth: 1,
    borderColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: MAIN.DEFAULT,
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  bookmarkContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkCount: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "400",
    color: BLACK,
    marginTop: 4,
  },
});

export default styles;
