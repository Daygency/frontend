import { StyleSheet, Platform } from "react-native";
import { WHITE, GRAY, MAIN } from "../../../color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
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
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  tagline: {
    fontSize: 13,
    color: MAIN.DEFAULT,
    marginBottom: 4,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 48,
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
  googleButtonDisabled: {
    opacity: 0.55,
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
  googleIconContainer: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4285F4",
  },
  divider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM_2,
    marginVertical: 24,
  },
  browseButton: {
    backgroundColor: GRAY.DEFAULT_1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
});
