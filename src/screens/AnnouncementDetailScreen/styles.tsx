import { Dimensions, StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const HERO_IMAGE_WIDTH = Dimensions.get("window").width;
const HERO_IMAGE_HEIGHT = HERO_IMAGE_WIDTH * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  detailInner: {
    flex: 1,
  },
  detailScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroImageWrap: {
    width: "100%",
    position: "relative",
  },
  heroImageSlide: {
    width: HERO_IMAGE_WIDTH,
    height: HERO_IMAGE_HEIGHT,
  },
  heroImage: {
    width: HERO_IMAGE_WIDTH,
    height: HERO_IMAGE_HEIGHT,
  },
  heroImageDots: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  heroImageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  heroImageDotActive: {
    backgroundColor: WHITE,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleRow: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 30,
  },
  authorName: {
    fontSize: 13,
    lineHeight: 18,
    color: BLACK,
    fontWeight: "500",
    maxWidth: 120,
    flexShrink: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 24,
  },
  metaText: {
    fontSize: 13,
    lineHeight: 18,
    color: BLACK,
    fontWeight: "500",
    flexShrink: 1,
  },
  metaDot: {
    fontSize: 13,
    lineHeight: 18,
    color: GRAY.MEDIUM_100,
  },
  locationText: {
    fontSize: 13,
    lineHeight: 18,
    color: BLACK,
    fontWeight: "500",
    flexShrink: 1,
  },
  postedDateText: {
    fontSize: 12,
    lineHeight: 18,
    color: GRAY.MEDIUM_100,
    fontWeight: "400",
    flexShrink: 0,
    marginTop: -14,
    marginBottom: 10,
  },
  postedDateDivider: {
    alignSelf: "center",
    width: "100%",
    height: 1,
    backgroundColor: GRAY.MEDIUM_2,
    marginBottom: 14,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  detailInfoCard: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 14,
  },
  sectionInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  sectionInlineRowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 18,
    marginBottom: 8,
  },
  sectionHeadingInline: {
    width: 72,
    fontSize: 13,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 18,
    flexShrink: 0,
  },
  bodySectionBlock: {
    marginBottom: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: BLACK,
  },
  deadlineText: {
    fontSize: 14,
    lineHeight: 22,
    color: BLACK,
    fontWeight: "500",
  },
  priceText: {
    fontSize: 14,
    lineHeight: 22,
    color: MAIN.DEFAULT,
    fontWeight: "600",
  },
  recruitmentMajorsChips: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    minWidth: 0,
  },
  attachmentsCard: {
    marginBottom: 14,
    gap: 8,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 13,
    color: BLACK,
  },
  fileSize: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  performersFixedPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  performersFixedPanelCollapsed: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  floatingBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: GRAY.MEDIUM_2,
  },
  btnBookmark: {
    width: 52,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#0069FF",
    alignItems: "center",
    justifyContent: "center",
  },
  btnApply: {
    flex: 1,
    backgroundColor: "#0069FF",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnApplyFull: {
    flex: 1,
  },
  btnApplyDisabled: {
    backgroundColor: GRAY.MEDIUM_100,
  },
  btnApplyText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: WHITE,
  },
  btnApplyContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  visitorInfoBar: {
    backgroundColor: GRAY.DEFAULT,
  },
  visitorInfoText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: GRAY.DARK,
  },
  headerRightWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  chatInquiryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: GRAY.MEDIUM_2,
  },
  chatInquiryButtonPending: {
    opacity: 0.5,
  },
  chatInquiryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: BLACK,
  },
});

export default styles;
