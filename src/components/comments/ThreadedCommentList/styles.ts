import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../../color";

export const COMMENT_AVATAR_SIZE = 36;
export const REPLY_AVATAR_SIZE = 28;

const styles = StyleSheet.create({
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentBlock: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingVertical: 12,
  },
  avatarColumn: {
    width: COMMENT_AVATAR_SIZE,
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
  commentBody: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
    flex: 1,
    minWidth: 0,
  },
  author: {
    fontSize: 15,
    fontWeight: "700",
    color: BLACK,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: BLACK,
  },
  date: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
  replyDate: {
    fontSize: 13,
    color: GRAY.DARK_2,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: BLACK,
  },
  mentionText: {
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  likeAction: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 14,
    color: GRAY.DARK_2,
    fontWeight: "500",
  },
  topActions: {
    flexShrink: 0,
    alignItems: "flex-end",
    gap: 2,
    minWidth: 30,
  },
  dotsButton: {
    width: 18,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
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
});

export default styles;
