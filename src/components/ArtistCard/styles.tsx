import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

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
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  bookmarkContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkCount: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
    marginTop: 4,
  },
});

export default styles;

