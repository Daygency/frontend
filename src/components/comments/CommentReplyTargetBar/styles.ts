import { BLACK, GRAY } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  targetText: {
    fontSize: 13,
    color: GRAY.DARK_100,
  },
  cancelText: {
    fontSize: 13,
    color: BLACK,
    fontWeight: "600",
  },
}));

export default styles;
