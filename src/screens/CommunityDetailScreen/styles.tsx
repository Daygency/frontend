import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

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
  postSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  categoryText: {
    fontSize: 13,
    color: GRAY.DARK_100,
    marginBottom: 10,
  },
  postTitleLarge: {
    fontSize: 22,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 30,
    marginBottom: 16,
  },
  authorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  authorMetaText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
    color: BLACK,
  },
  postDate: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  contentDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GRAY.MEDIUM,
    marginBottom: 16,
  },
  postBody: {
    fontSize: 15,
    lineHeight: 24,
    color: BLACK,
  },
  carouselWrap: {
    width: "100%",
    position: "relative",
    marginTop: 16,
  },
  pageBadge: {
    position: "absolute",
    right: 16,
    bottom: 16,
    zIndex: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  pageBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: WHITE,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 14,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionCount: {
    fontSize: 14,
    fontWeight: "500",
    color: BLACK,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GRAY.MEDIUM,
    marginTop: 16,
    marginBottom: 4,
  },
  commentInputContainer: {
    backgroundColor: WHITE,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: GRAY.MEDIUM,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BLACK,
  },
  viewCount: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
});

export default styles;
