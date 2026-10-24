import { BLACK, GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";

const styles = themedStyles(() => ({
  container: {
    position: "relative",
    // flexShrink: 0,
  },
  button: {
    ...SMOOTH_CORNERS,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
    paddingHorizontal: 12,
    gap: 6,
    height: 36,
  },
  buttonText: {
    color: MAIN.DEFAULT,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 20,
  },
  iconContainer: {
    flexShrink: 0,
  },
  sortButton: {
    ...SMOOTH_CORNERS,
    backgroundColor: WHITE,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
    paddingHorizontal: 12,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  sortButtonText: {
    color: MAIN.DEFAULT,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 20,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.DEFAULT,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  optionsScroll: {
    flex: 1,
  },
  optionsContent: {
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
  confirmButton: {
    backgroundColor: MAIN.FILL,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: FIXED_WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
}));

export default styles;








