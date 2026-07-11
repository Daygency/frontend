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
  heroBanner: {
    width: "100%",
    marginBottom: 4,
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
    gap: 12,
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 30,
    minWidth: 0,
  },
  titleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 3,
    flexShrink: 0,
  },
  titleActionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  titleActionCount: {
    fontSize: 14,
    color: BLACK,
    fontWeight: "600",
    minWidth: 14,
    fontVariant: ["tabular-nums"],
  },
  sectionInlineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 12,
  },
  sectionLabel: {
    width: 72,
    fontSize: 13,
    lineHeight: 20,
    color: GRAY.DARK_2,
    fontWeight: "500",
    flexShrink: 0,
  },
  sectionValuePressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minWidth: 0,
  },
  sectionValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: BLACK,
    fontWeight: "500",
    minWidth: 0,
  },
  sectionValueAccent: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: MAIN.DEFAULT,
    fontWeight: "600",
    minWidth: 0,
  },
  bodySectionBlock: {
    marginTop: 10,
    marginBottom: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: BLACK,
  },
  descriptionEmpty: {
    color: GRAY.DARK_100,
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
  actionDivider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM_2,
    marginTop: 4,
    marginBottom: 14,
  },
  loadMoreCommentsButton: {
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: GRAY.MEDIUM_2,
  },
  loadMoreCommentsText: {
    fontSize: 13,
    fontWeight: "600",
    color: BLACK,
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
  actionRow: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 44,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionCount: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "600",
  },
  commentInputWrapper: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: GRAY.DEFAULT,
  },
});

export type MusicNewsDetailScreenStyles = typeof styles;

export default styles;
