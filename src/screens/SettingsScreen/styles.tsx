import { WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  listSection: {
    marginTop: 12,
  },
}));

export default styles;
