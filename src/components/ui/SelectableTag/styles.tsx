import { BLACK, GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  tag: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 12,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  tagSelected: {
    backgroundColor: MAIN.FILL,
    borderColor: MAIN.DEFAULT,
  },
  tagPressed: {
    opacity: 0.5,
  },
  tagText: {
    color: BLACK,
    fontSize: 13,
    fontWeight: "400",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 18,
  },
  tagTextSelected: {
    color: FIXED_WHITE,
  },
}));

export default styles;

