import { BLACK, GRAY, WHITE, lightDark } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";

const styles = themedStyles(() => ({
  tag: {
    ...SMOOTH_CORNERS,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  typeTag: {
    backgroundColor: lightDark("#EDF2F7", "#262C3A"),
  },
  typeTagText: {
    fontSize: 11,
    color: lightDark("#4A5568", "#C4C6CC"),
    fontWeight: "500",
  },
  statusTag: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BLACK,
  },
  statusTagText: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.24,
    color: BLACK,
    fontWeight: "400",
  },
  reactionTag: {
    backgroundColor: GRAY.MEDIUM,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reactionTagText: {
    fontSize: 13,
    color: GRAY.DARK_100,
    fontWeight: "400",
  },
}));

export default styles;


