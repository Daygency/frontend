import { GRAY, WHITE, FIXED_WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: WHITE,
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#0069FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  registerButtonDisabled: {
    backgroundColor: GRAY.MEDIUM_100,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
}));

export default styles;
