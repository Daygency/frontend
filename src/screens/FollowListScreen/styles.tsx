import { GRAY, WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabView: {
    flex: 1,
    marginTop: 10,
  },
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  messageText: {
    fontSize: 15,
    color: GRAY.DARK_2,
    textAlign: "center",
    lineHeight: 22,
  },
}));

export default styles;
