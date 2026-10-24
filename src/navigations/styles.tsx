import { BLACK } from "../color";
import { themedStyles } from "../theme/themedStyles";

const styles = themedStyles(() => ({
  titleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    lineHeight: 45,
    fontWeight: "600",
    marginLeft: -10,
    color: BLACK,
  },
  leftIcon: {},
  rightItemsWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  }
}));

export default styles;
