import { GRAY, BLACK } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GRAY.MEDIUM,
  },
  profileNameContainer: {
    flex: 1,
    marginLeft: 10,
  },
  authorText: {
    fontSize: 14,
    fontWeight: "500",
    color: BLACK,
  },
  dateText: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginTop: 2,
  },
  dotsContainer: {
    padding: 4,
  },
  contentContainer: {
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  content: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
    lineHeight: 20,
    marginTop: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
}));

export default styles;
