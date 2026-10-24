import { BLACK } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 19,
    lineHeight: 27,
    letterSpacing: -0.32,
    fontWeight: "600",
    color: BLACK,
  },
  content: {
    marginTop: 5,
    gap: 5,
    paddingHorizontal: 20,
  },
}));

export default styles;

