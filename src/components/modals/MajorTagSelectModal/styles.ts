import { GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAY.DARK_1,
    marginTop: 10,
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
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 12,
  },
  tag: {
    ...SMOOTH_CORNERS,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
  },
  tagSelected: {
    backgroundColor: MAIN.FILL,
    borderColor: MAIN.DEFAULT,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "400",
    color: MAIN.DEFAULT,
  },
  tagTextSelected: {
    color: FIXED_WHITE,
    fontWeight: "500",
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
