import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 96,
  },
  header: {
    marginBottom: 16,
  },
  tagBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: GRAY.MEDIUM,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    color: BLACK,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  body: {
    marginTop: 16,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: BLACK,
  },
  bodyDivider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM,
    marginTop: 18,
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
    color: "#717182",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  statText: {
    fontSize: 12,
    color: GRAY.DARK_100,
  },
  dot: {
    fontSize: 12,
    color: GRAY.DARK_100,
    marginHorizontal: 4,
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
  commentInputContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 90,
    paddingHorizontal: 16,
    paddingTop: 12,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: GRAY.MEDIUM,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  commentInput: {
    fontSize: 13,
    color: BLACK,
    maxHeight: 80,
  },
});

export default styles;

