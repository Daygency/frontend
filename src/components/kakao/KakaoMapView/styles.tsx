import { BLACK, GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: GRAY.DEFAULT,
  },
  openBadgeText: {
    color: FIXED_WHITE,
    fontSize: 12,
    fontWeight: "600",
  },
  addressOnly: {
    padding: 16,
    gap: 12,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    color: MAIN.DEFAULT,
    fontWeight: "600",
  },
  openBadgeInline: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: MAIN.FILL,
  },
  plainText: {
    fontSize: 14,
    lineHeight: 21,
    color: BLACK,
  },
  plainLink: {
    color: GRAY.DARK,
    textDecorationLine: "underline",
  },
  plainChevron: {
    color: GRAY.DARK,
  },
}));

export default styles;
