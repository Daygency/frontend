import { GRAY, MAIN, WHITE, FIXED_WHITE, lightDark } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.DEFAULT,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: lightDark("#333", "#C4C6CC"),
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: GRAY.DEFAULT,
  },
  completeButton: {
    backgroundColor: MAIN.FILL,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
}));

export default styles;
