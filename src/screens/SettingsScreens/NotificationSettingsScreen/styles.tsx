import { GRAY, MAIN, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  hintBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: GRAY.DARK_100,
    marginBottom: 8,
  },
  hintBody: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.DARK,
  },
  hintStatus: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  settingsLink: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  settingsLinkText: {
    fontSize: 13,
    fontWeight: "600",
    color: MAIN.DEFAULT,
    textDecorationLine: "underline",
  },
}));

export default styles;
