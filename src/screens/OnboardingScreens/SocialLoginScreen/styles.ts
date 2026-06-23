import { StyleSheet, Platform } from "react-native";
import { WHITE, GRAY, MAIN } from "../../../color";

const WHITE_LOGO_ASPECT_RATIO = 660 / 595;
const LOGO_HEIGHT = 32 + 30;
const LOGO_WIDTH = Math.min(LOGO_HEIGHT * WHITE_LOGO_ASPECT_RATIO, 88) + 30;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: MAIN.DEFAULT,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  naverButton: {
    backgroundColor: "#03C75A",
  },
  googleButton: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  kakaoButtonText: {
    color: "#000",
  },
  naverButtonText: {
    color: WHITE,
  },
  googleButtonText: {
    color: "#000",
  },
  naverLogo: {
    fontSize: 18,
    fontWeight: "800",
    color: WHITE,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: Platform.OS === "ios" ? 24 : 22,
  },
  googleLogo: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
});
