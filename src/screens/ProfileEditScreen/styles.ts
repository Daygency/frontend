import { Platform } from "react-native";
import { BLACK, BLUE, GRAY, MAIN, WHITE, FIXED_WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";
import {
  portfolioBodyBg,
  PORTFOLIO_SECTION_GAP,
} from "../../constants/portfolio";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: WHITE,
  },
  profileImageChangeText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "500",
    color: GRAY.DARK,
  },
  profileImageOuter: {
    width: 120,
    height: 120,
    position: "relative",
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: GRAY.MEDIUM,
    overflow: "hidden",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: GRAY.DARK_1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MAIN.FILL,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    backgroundColor: WHITE,
  },
  tabBarRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonLeft: {
    marginRight: 6,
  },
  tabButtonRight: {
    marginLeft: 6,
  },
  tabButtonActive: {
    backgroundColor: MAIN.FILL,
  },
  tabButtonInactive: {
    backgroundColor: GRAY.DEFAULT,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tabButtonTextActive: {
    color: FIXED_WHITE,
  },
  tabButtonTextInactive: {
    color: GRAY.DARK,
  },
  tabView: {
    flex: 1,
    backgroundColor: portfolioBodyBg(),
  },
  scrollContentContainer: {
    paddingBottom: 140,
    backgroundColor: portfolioBodyBg(),
  },
  tabContent: {
    flex: 1,
  },
  tabContentContainer: {
    paddingTop: PORTFOLIO_SECTION_GAP,
    paddingBottom: 120,
    backgroundColor: portfolioBodyBg(),
  },
  contentSheet: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: PORTFOLIO_SECTION_GAP,
  },
  field: {
    marginBottom: 16,
  },
  fieldLast: {
    marginBottom: 0,
  },
  privateToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  privateToggleTextWrap: {
    flex: 1,
    gap: 4,
  },
  privateToggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: GRAY.DARK_100,
  },
  privateToggleDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.DARK_2,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK_100,
    marginBottom: 8,
  },
  labelFocused: {
    color: BLUE.DEFAULT,
  },
  input: {
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 16,
    lineHeight: 20,
    color: GRAY.DARK_100,
    backgroundColor: WHITE,
  },
  singleLineInput: {
    minHeight: 48,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginLeft: 12,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 16,
    color: GRAY.DARK_2,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: Platform.OS === "ios" ? 14 : 12,
  },
  inputFocused: {
    borderColor: BLUE.DEFAULT,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: WHITE,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  button: {
    width: "100%",
    backgroundColor: MAIN.FILL,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: FIXED_WHITE,
  },

  // ── 섹션 & 헤더 ──
  section: {
    marginBottom: 0,
  },
  sectionCard: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: GRAY.DARK_100,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  sectionHeaderTextBlock: {
    flex: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: GRAY.DEFAULT_1,
  },
  sectionHeaderIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: GRAY.DEFAULT_1,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
  emptyHint: {
    fontSize: 13,
    color: GRAY.DARK_2,
    textAlign: "center",
    paddingVertical: 12,
  },

  // ── 항목 (플랫 리스트) ──
  entryDivider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM,
  },
  entryCard: {
    paddingVertical: 16,
    gap: 12,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GRAY.MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  // ── 날짜 드롭다운 (LinkedIn 스타일) ──
  periodFields: {
    gap: 4,
  },
  dateFieldGroup: {
    marginTop: 4,
    gap: 6,
  },
  dateFieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: GRAY.DARK_100,
  },
  datePickerField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 46,
  },
  datePickerFieldDisabled: {
    opacity: 0.45,
  },
  datePickerFieldText: {
    fontSize: 14,
    color: BLACK,
  },
  datePickerFieldTextPlaceholder: {
    color: GRAY.DARK_2,
  },
  dateDropdownRow: {
    flexDirection: "row",
    gap: 8,
  },
  dateDropdownWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 8,
    backgroundColor: WHITE,
    overflow: "hidden",
  },
  dateDropdownDisabled: {
    opacity: 0.45,
  },
  dateDropdown: {
    height: 44,
    paddingHorizontal: 12,
  },
  dateDropdownPlaceholder: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  dateDropdownText: {
    fontSize: 14,
    color: GRAY.DARK_100,
  },
  dateDropdownItemText: {
    fontSize: 14,
    color: GRAY.DARK_100,
  },
  dateDropdownContainer: {
    borderRadius: 8,
    borderColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
  },
  dateDropdownIcon: {
    width: 18,
    height: 18,
  },
  currentToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    paddingVertical: 4,
  },
  currentToggleText: {
    fontSize: 14,
    color: GRAY.DARK_100,
  },

  // ── (legacy) 날짜 선택 버튼 ──
  ymRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  ymLabel: {
    fontSize: 13,
    color: GRAY.DARK_100,
    width: 52,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 9 : 7,
    backgroundColor: GRAY.DEFAULT_1,
  },
  datePickerButtonFilled: {
    borderColor: MAIN.DEFAULT,
    backgroundColor: WHITE,
  },
  datePickerText: {
    flex: 1,
    fontSize: 13,
    color: GRAY.DARK_2,
  },
  datePickerTextFilled: {
    color: MAIN.DEFAULT,
    fontWeight: "500",
  },

  // ── 파일 첨부 버튼 ──
  filePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: WHITE,
  },
  filePickerText: {
    fontSize: 13,
    color: MAIN.DEFAULT,
    flex: 1,
  },

  // ── 항목 완료 버튼 ──
  entryButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  entryCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  entryCompleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: MAIN.FILL,
    alignItems: "center",
    justifyContent: "center",
  },
  entryCancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: GRAY.DARK_2,
  },
  entryCompleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: FIXED_WHITE,
  },

  // ── 항목 접힌(요약) 뷰 ──
  entryCompactCard: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  entryCompactInfo: {
    flex: 1,
    gap: 2,
  },
  entryCompactDescription: {
    fontSize: 13,
    fontWeight: "500",
    color: GRAY.DARK_100,
    lineHeight: 18,
  },
  entryCompactPeriod: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginTop: 2,
  },
  entryCompactActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  entryCompactIconButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default styles;
