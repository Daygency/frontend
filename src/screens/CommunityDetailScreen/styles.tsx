import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

const AVATAR_SIZE = 36;
const REPLY_AVATAR_SIZE = 28;

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
  },
  pageBadge: {
    position: "absolute",
    top: 22,
    right: 10,
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
  avatarColumn: {
    width: AVATAR_SIZE,
    marginRight: 12,
    alignItems: "center",
  },
  threadLine: {
    flex: 1,
    width: 2,
    backgroundColor: GRAY.MEDIUM,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 1,
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentBlock: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingVertical: 12,
  },
  commentContent: {
    flex: 1,
    minWidth: 0,
  },
  commentTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  commentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
    flex: 1,
    minWidth: 0,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: "700",
    color: BLACK,
  },
  commentDate: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
    color: BLACK,
  },
  commentStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  commentCount: {
    fontSize: 14,
    fontWeight: "500",
    color: BLACK,
    marginRight: 8,
  },
  replyActionText: {
    fontSize: 14,
    color: GRAY.DARK_2,
    fontWeight: "500",
  },
  replyList: {
    marginTop: 8,
    gap: 12,
  },
  replyBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  replyAvatarColumn: {
    width: REPLY_AVATAR_SIZE,
    alignItems: "center",
  },
  replyBody: {
    flex: 1,
    minWidth: 0,
  },
  replyMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: BLACK,
  },
  replyDate: {
    fontSize: 13,
    color: GRAY.DARK_2,
  },
  replyText: {
    fontSize: 15,
    lineHeight: 22,
    color: BLACK,
  },
  replyStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  replyCount: {
    fontSize: 13,
    fontWeight: "500",
    color: BLACK,
  },
  commentInputContainer: {
    backgroundColor: WHITE,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: GRAY.MEDIUM,
  },
  replyComposerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  replyComposerText: {
    fontSize: 13,
    color: GRAY.DARK_100,
  },
  replyComposerCancel: {
    fontSize: 13,
    color: BLACK,
    fontWeight: "600",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BLACK,
  },
  navSubtitle: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginTop: 1,
  },
});

export default styles;
export { AVATAR_SIZE, REPLY_AVATAR_SIZE };
