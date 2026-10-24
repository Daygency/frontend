import { MAIN, WHITE, FIXED_WHITE, BLACK, lightDark } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 16,
  },
  body: {
    fontSize: 15,
    color: lightDark("#333", "#C4C6CC"),
    lineHeight: 24,
    marginBottom: 12,
  },
  meta: {
    fontSize: 13,
    color: lightDark("#666", "#A0A3AB"),
    lineHeight: 20,
    marginTop: 8,
  },
  floatingBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
    backgroundColor: "transparent",
  },
  primaryButton: {
    backgroundColor: MAIN.FILL,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    color: lightDark("#666", "#A0A3AB"),
  },
}));

export default styles;
