import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../../color";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 9,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  profileTagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profileTag: {
    fontSize: 12,
    letterSpacing: 0.24,
    fontWeight: "400",
    color: WHITE,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  profileImageContainer: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: GRAY.MEDIUM,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfoContainer: {
    flex: 1,
    gap: 10,
  },
  profileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileFollowerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileFollowingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  profileIntroduction: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: "400",
    color: GRAY.DARK,
    marginTop: 13,
  },
  profileSettingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 13,
    justifyContent: "space-between",
  },
  profileEditContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 4,
    height: 34,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 10,
    justifyContent: "center",
    paddingVertical: 6,
  },
  profilePrivateContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 4,
    height: 34,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 10,
    justifyContent: "center",
  },
  profileEditText: {
    fontSize: 14,
    letterSpacing: 0.24,
    fontWeight: "400",
    color: WHITE,
  },
  profilePrivateText: {
    fontSize: 14,
    letterSpacing: 0.24,
    fontWeight: "400",
    color: WHITE,
  },
});

export default styles;
