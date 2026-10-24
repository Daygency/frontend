import { GRAY, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    width: "100%",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  shadow: {
    shadowOpacity: 0,
    elevation: 0,
  },
}));

export default styles;

