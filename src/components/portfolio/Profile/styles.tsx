import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";
import {
  PORTFOLIO_BODY_BG,
  PORTFOLIO_IMMERSIVE_BG,
  PORTFOLIO_SECTION_GAP,
} from "../../../constants/portfolio";

export const PROFILE_AVATAR_SIZE = 100;
export const PROFILE_BANNER_RATIO = 0.24;

const styles = StyleSheet.create({
  container: {
    backgroundColor: PORTFOLIO_BODY_BG,
    marginBottom: PORTFOLIO_SECTION_GAP,
  },
  profileCard: {
    backgroundColor: WHITE,
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    backgroundColor: PORTFOLIO_IMMERSIVE_BG,
    position: "relative",
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerDimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  bannerBottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  bannerActionRow: {
    position: "absolute",
    right: 12,
    bottom: 12,
    flexDirection: "row",
    gap: 8,
  },
  bannerActionBtn: {
    height: 32,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(31, 42, 68, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(217, 217, 217, 0.5)",
  },
  bannerActionBtnPressed: {
    opacity: 0.5,
  },
  bannerActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: WHITE,
  },
  profileBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarWrapper: {
    width: PROFILE_AVATAR_SIZE,
    height: PROFILE_AVATAR_SIZE,
    marginTop: -(PROFILE_AVATAR_SIZE / 2),
    marginBottom: 8,
    position: "relative",
  },
  avatarEditBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(31, 42, 68, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: WHITE,
  },
  profileImageContainer: {
    width: PROFILE_AVATAR_SIZE,
    height: PROFILE_AVATAR_SIZE,
    borderRadius: PROFILE_AVATAR_SIZE / 2,
    backgroundColor: GRAY.MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: WHITE,
  },
  profileImage: {
    width: PROFILE_AVATAR_SIZE,
    height: PROFILE_AVATAR_SIZE,
    borderRadius: PROFILE_AVATAR_SIZE / 2,
  },
  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: BLACK,
    letterSpacing: -0.3,
  },
  profileHeadline: {
    fontSize: 14,
    lineHeight: 20,
    color: GRAY.DARK_100,
    marginBottom: 6,
  },
  profileTagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileTag: {
    fontSize: 11,
    letterSpacing: 0.2,
    fontWeight: "600",
    color: WHITE,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  profileFollowerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  followStatHit: {
    paddingVertical: 2,
    paddingRight: 4,
  },
  followStatText: {
    fontSize: 14,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  profileIntroduction: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
    fontWeight: "400",
    color: GRAY.DARK_100,
    marginBottom: 14,
  },
  profileIntroSection: {
    marginBottom: 14,
    gap: 8,
  },
  profileMajorTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  otherProfileActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  otherFollowBtn: {
    flex: 1,
    minWidth: 100,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: MAIN.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  otherFollowBtnOutline: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
  },
  otherFollowBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: WHITE,
  },
  otherFollowBtnTextOutline: {
    color: MAIN.DEFAULT,
  },
  otherChatBtn: {
    flex: 1,
    minWidth: 100,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GRAY.DARK_2,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  otherChatBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: GRAY.DARK_100,
  },
});

export default styles;
