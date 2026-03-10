import { StyleSheet } from "react-native";
import { WHITE, MAIN, RED } from "../../color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    backgroundColor: WHITE,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "600",
    color: MAIN.DEFAULT,
    textAlign: "center",
    marginBottom: 24,
  },
  mainQuestion: {
    fontSize: 22,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    textAlign: "left",
    marginBottom: 12,
    marginTop: 20,
  },
  subText: {
    fontSize: 15,
    color: "#9E9E9E",
    textAlign: "left",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: RED.DARK,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: 32,
  },
  optionsContainer: {
    width: "100%",
    gap: 16,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  artistOption: {
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF9E6",
  },
  plannerOption: {
    borderColor: "#E0E0E0",
    backgroundColor: "#E8F5E9",
  },
  optionPressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  artistIconWrap: {},
  plannerIconWrap: {},
  textWrap: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 14,
    color: MAIN.DEFAULT,
    lineHeight: 20,
  },
  footerText: {
    fontSize: 14,
    color: MAIN.DEFAULT,
    textAlign: "center",
    marginTop: 40,
    alignSelf: "center",
  },
});
