import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

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
  bodyImageBanner: {
    position: "relative",
    marginTop: 14,
  },
  bodyImageBannerWithDivider: {
    borderBottomWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingBottom: 14,
    marginBottom: 14,
  },
  imageCounter: {
    position: "absolute",
    right: 12,
    bottom: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageCounterText: {
    fontSize: 12,
    fontWeight: "600",
    color: WHITE,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 30,
  },
  authorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 120,
    marginTop: 2,
  },
  authorName: {
    fontSize: 12,
    lineHeight: 16,
    color: BLACK,
    fontWeight: "500",
    flexShrink: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  locationText: {
    fontSize: 13,
    lineHeight: 18,
    color: BLACK,
    fontWeight: "500",
    flexShrink: 1,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  sectionInlineRowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 18,
    marginBottom: 8,
  },
  sectionHeadingInline: {
    fontSize: 13,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 18,
    flexShrink: 0,
  },
  bodySectionBlock: {
    marginBottom: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: GRAY.MEDIUM_2,
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
  locationCard: {
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: WHITE,
  },
  addressInCard: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: GRAY.DEFAULT,
  },
  addressText: {
    fontSize: 13,
    lineHeight: 20,
    color: GRAY.DARK,
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
  performersSection: {
    marginBottom: 14,
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
    height: 52,
    borderRadius: 10,
    backgroundColor: MAIN.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  btnApply: {
    flex: 1,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnApplyFull: {
    flex: 1,
  },
  btnApplyText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: WHITE,
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
});

export default styles;
