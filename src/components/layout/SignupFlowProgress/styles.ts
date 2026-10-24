import { MAIN, GRAY, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

export const styles = themedStyles(() => ({
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: WHITE,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: MAIN.FILL,
  },
  dotInactive: {
    backgroundColor: GRAY.MEDIUM_2,
  },
}));
