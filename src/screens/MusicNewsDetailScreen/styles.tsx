import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  posterWrapper: {
    width: "100%",
  },
  posterImage: {
    backgroundColor: GRAY.MEDIUM,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: BLACK,
    marginRight: 12,
  },
  uploadedAt: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  infoCard: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: BLACK,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: BLACK,
    marginBottom: 18,
  },
  attachmentsCard: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 12,
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
  firstCommentPlaceholder: {
    marginTop: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  firstCommentText: {
    fontSize: 13,
    color: GRAY.DARK_2,
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
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#102042",
    alignItems: "center",
    justifyContent: "center",
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
    borderLeftWidth: 1,
    borderLeftColor: GRAY.MEDIUM,
    gap: 8,
  },
  replyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    position: "relative",
  },
  replyElbow: {
    position: "absolute",
    left: -16,
    top: 12,
    width: 12,
    height: 1,
    backgroundColor: GRAY.MEDIUM,
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
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    backgroundColor: WHITE,
  },
});

export default styles;
