import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../../../color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM_2,
    backgroundColor: WHITE,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    borderRadius: 22,
  },
  editBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.DARK_1,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: BLACK,
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "400",
    color: GRAY.DARK_2,
  },
});

export default styles;
