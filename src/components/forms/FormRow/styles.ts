import { Platform, StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../../color";

const inputReset = Platform.select({
  web: { outlineStyle: "none", borderWidth: 0 } as object,
  default: {},
});

const styles = StyleSheet.create({
  section: {
    paddingVertical: 4,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GRAY.DARK_1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginTop: 12,
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.DARK_2,
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
    paddingVertical: 6,
    gap: 12,
  },
  rowPressed: {
    opacity: 0.55,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  labelWrap: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    color: BLACK,
    letterSpacing: -0.2,
  },
  labelError: {
    color: RED.DEFAULT,
  },
  required: {
    fontSize: 13,
    color: RED.DARK,
    marginLeft: 2,
    marginTop: -4,
  },
  accessory: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  below: {
    paddingBottom: 10,
    gap: 8,
  },
  errorText: {
    marginTop: -4,
    marginBottom: 6,
    fontSize: 12,
    lineHeight: 16,
    color: RED.DEFAULT,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.DARK_2,
  },

  valueText: {
    fontSize: 14,
    color: GRAY.DARK_100,
    flexShrink: 1,
    textAlign: "right",
  },
  valuePlaceholder: {
    color: GRAY.MEDIUM_100,
  },

  chip: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: GRAY.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  chipPressed: {
    backgroundColor: GRAY.MEDIUM,
  },
  chipError: {
    backgroundColor: "#FDECEC",
  },
  chipText: {
    fontSize: 14,
    color: BLACK,
    fontVariant: ["tabular-nums"],
  },
  chipTextError: {
    color: RED.DEFAULT,
  },

  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: BLACK,
    textAlign: "right",
    paddingVertical: Platform.OS === "ios" ? 6 : 2,
    paddingHorizontal: 0,
    ...inputReset,
  },
  inputSuffix: {
    fontSize: 14,
    color: GRAY.DARK_100,
  },

  /** 단일 줄 TextInput은 높이를 명시해야 한글 윗부분이 잘리지 않음 */
  titleInput: {
    height: 52,
    fontSize: 18,
    fontWeight: "600",
    color: BLACK,
    letterSpacing: -0.3,
    paddingVertical: 0,
    paddingHorizontal: 0,
    ...inputReset,
  },

  textAreaBox: {
    borderRadius: 12,
    backgroundColor: WHITE,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
  },
  textAreaBoxFocused: {
    borderColor: MAIN.DEFAULT,
  },
  textAreaBoxError: {
    borderColor: RED.DEFAULT,
  },
  textArea: {
    minHeight: 110,
    fontSize: 14,
    lineHeight: 21,
    color: BLACK,
    padding: 0,
    ...inputReset,
  },
  textAreaFooter: {
    marginTop: 8,
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  counterText: {
    fontSize: 12,
    color: GRAY.MEDIUM_100,
    fontVariant: ["tabular-nums"],
  },

  segment: {
    flexDirection: "row",
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 9,
    padding: 2,
  },
  segmentItem: {
    height: 28,
    paddingHorizontal: 9,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentItemSelected: {
    backgroundColor: WHITE,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  segmentTextSelected: {
    color: BLACK,
    fontWeight: "600",
  },

  thumbList: {
    paddingTop: 8,
    paddingRight: 8,
    gap: 10,
  },
  thumbItem: {
    position: "relative",
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: GRAY.MEDIUM,
  },
  thumbRemove: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: WHITE,
    borderRadius: 12,
    zIndex: 1,
    elevation: 2,
  },
});

export default styles;
