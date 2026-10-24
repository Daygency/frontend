import { GRAY } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  text: {
    fontSize: 14,
    color: GRAY.DARK_100,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 32,
  },
}));

export default styles;
