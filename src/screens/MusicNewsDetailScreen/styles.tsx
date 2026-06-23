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
  carouselWrapper: {
    width: "100%",
    marginBottom: 4,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: BLACK,
    lineHeight: 30,
    marginRight: 12,
  },
  uploadedAt: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM_2,
    marginVertical: 14,
  },
  infoBlock: {
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: GRAY.DARK,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "700",
    lineHeight: 24,
  },
  mapSection: {
    borderRadius: 12,
    overflow: "hidden",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: BLACK,
    marginBottom: 4,
  },
  attachmentsCard: {
    gap: 8,
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 4,
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
  commentList: {
    marginTop: 10,
    gap: 14,
  },
  commentCard: {
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  myCommentCard: {
    backgroundColor: "transparent",
  },
  commentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  commentAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  commentHeaderText: {
    flex: 1,
  },
  commentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: MAIN.DEFAULT,
  },
  commentDate: {
    fontSize: 13,
    color: "#717182",
  },
  commentContent: {
    fontSize: 15,
    color: MAIN.DEFAULT,
    fontWeight: "500",
    marginBottom: 5,
  },
  commentStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 50,
  },
  commentCount: {
    fontSize: 14,
    color: MAIN.DEFAULT,
    marginRight: 8,
    fontWeight: "600",
  },
  replyList: {
    marginTop: 10,
    marginLeft: 18,
    paddingLeft: 16,
    gap: 8,
  },
  replyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    position: "relative",
  },
  replyAvatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#102042",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  replyBody: {
    flex: 1,
    paddingTop: 1,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: MAIN.DEFAULT,
  },
  replyMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  replyDate: {
    fontSize: 13,
    color: "#717182",
  },
  replyContent: {
    fontSize: 15,
    color: MAIN.DEFAULT,
    marginBottom: 3,
  },
  replyStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  replyCount: {
    fontSize: 13,
    color: MAIN.DEFAULT,
    fontWeight: "600",
  },
  commentInputWrapper: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: GRAY.DEFAULT,
  },
});

export default styles;
