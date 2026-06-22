import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";

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
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
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
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWithCount: {
    alignItems: "center",
    justifyContent: "center",
  },
  musicNoteCount: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "400",
    color: "#F67777",
    marginTop: 4,
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
