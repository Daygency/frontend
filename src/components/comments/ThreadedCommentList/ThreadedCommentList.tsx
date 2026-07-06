import { useEffect, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import CommentAuthorAvatar from "../CommentAuthorAvatar/CommentAuthorAvatar";
import styles, {
  COMMENT_AVATAR_SIZE,
  REPLY_AVATAR_SIZE,
} from "./styles";

const SCROLL_TARGET_TOP_OFFSET = 12;

export type ThreadedCommentReply = {
  id: string;
  author: string;
  profileImgUrl?: string;
  createdAt?: string;
  content: string;
  likeCount?: number;
  isLiked?: boolean;
  isMine?: boolean;
  authorUserId?: string;
};

export type ThreadedComment = ThreadedCommentReply & {
  createdAt: string;
  replyCount: number;
  replies?: ThreadedCommentReply[];
};

type Props = {
  comments: ThreadedComment[];
  formatTimeAgo: (value?: string) => string;
  onPressAuthor: (authorUserId?: string, author?: string) => void;
  onToggleLike: (commentId: string, currentLiked: boolean) => void;
  onReply: (parentId: string, author: string) => void;
  onReport: (commentId: string, authorUserId: string) => void;
  onOpenOwnActions: (comment: Pick<ThreadedCommentReply, "id" | "content">) => void;
  scrollViewRef?: React.RefObject<ScrollView | null>;
  scrollAnchorRef?: React.RefObject<View | null>;
  scrollTargetId?: string | null;
  onScrollTargetHandled?: () => void;
};

const ThreadedCommentList = ({
  comments,
  formatTimeAgo,
  onPressAuthor,
  onToggleLike,
  onReply,
  onReport,
  onOpenOwnActions,
  scrollViewRef,
  scrollAnchorRef,
  scrollTargetId,
  onScrollTargetHandled,
}: Props) => {
  const commentNodes = useRef<Map<string, View>>(new Map());

  useEffect(() => {
    if (!scrollTargetId) return;
    const node = commentNodes.current.get(scrollTargetId);
    const anchor = scrollAnchorRef?.current;
    if (!node || !anchor) {
      onScrollTargetHandled?.();
      return;
    }
    node.measureLayout(
      anchor,
      (_x, y) => {
        scrollViewRef?.current?.scrollTo({
          y: Math.max(0, y - SCROLL_TARGET_TOP_OFFSET),
          animated: true,
        });
        onScrollTargetHandled?.();
      },
      () => onScrollTargetHandled?.(),
    );
  }, [scrollTargetId, comments, scrollViewRef, scrollAnchorRef, onScrollTargetHandled]);
  const renderTopActions = (comment: ThreadedCommentReply) => {
    if (!comment.isMine) return null;

    return (
      <View style={styles.topActions}>
        <Pressable
          hitSlop={8}
          onPress={() => onOpenOwnActions(comment)}
          style={styles.dotsButton}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={18}
            color={GRAY.DARK_2}
          />
        </Pressable>
      </View>
    );
  };

  const renderActions = (comment: ThreadedCommentReply, parentId: string) => (
    <View style={styles.actionRow}>
      <Pressable
        onPress={() => onToggleLike(comment.id, Boolean(comment.isLiked))}
        hitSlop={8}
        style={styles.likeAction}
      >
        <Ionicons
          name={comment.isLiked ? "heart" : "heart-outline"}
          size={14}
          color={GRAY.DARK_2}
        />
      </Pressable>
      <Text style={styles.actionText}>{comment.likeCount ?? 0}</Text>
      <Pressable
        onPress={() => onReply(parentId, comment.author)}
        hitSlop={8}
      >
        <Text style={styles.actionText}>답글</Text>
      </Pressable>
      {!comment.isMine && comment.authorUserId ? (
        <Pressable
          onPress={() => onReport(comment.id, comment.authorUserId!)}
          hitSlop={8}
        >
          <Text style={styles.actionText}>신고</Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <View style={styles.commentsSection}>
      {comments.map((comment, index) => {
        const isLast =
          index === comments.length - 1 && !comment.replies?.length;

        return (
          <View
            key={comment.id}
            style={styles.commentBlock}
            ref={(node) => {
              if (node) commentNodes.current.set(comment.id, node);
              else commentNodes.current.delete(comment.id);
            }}
          >
            <View style={styles.avatarColumn}>
              <Pressable
                onPress={() => onPressAuthor(comment.authorUserId, comment.author)}
                disabled={!comment.authorUserId}
                hitSlop={8}
              >
                <CommentAuthorAvatar
                  profileImgUrl={comment.profileImgUrl}
                  size={COMMENT_AVATAR_SIZE}
                />
              </Pressable>
              {!isLast || (comment.replies?.length ?? 0) > 0 ? (
                <View style={styles.threadLine} />
              ) : null}
            </View>

            <View style={styles.commentBody}>
              <View style={styles.topRow}>
                <View style={styles.metaRow}>
                  <Pressable
                    onPress={() => onPressAuthor(comment.authorUserId, comment.author)}
                    disabled={!comment.authorUserId}
                    hitSlop={8}
                  >
                    <Text style={styles.author}>{comment.author}</Text>
                  </Pressable>
                  {!!comment.createdAt && (
                    <Text style={styles.date}>
                      {formatTimeAgo(comment.createdAt)}
                    </Text>
                  )}
                </View>
                {renderTopActions(comment)}
              </View>

              <Text style={styles.bodyText}>{comment.content}</Text>
              {renderActions(comment, comment.id)}

              {!!comment.replies?.length && (
                <View style={styles.replyList}>
                  {comment.replies.map((reply) => (
                    <View
                      key={reply.id}
                      style={styles.replyBlock}
                      ref={(node) => {
                        if (node) commentNodes.current.set(reply.id, node);
                        else commentNodes.current.delete(reply.id);
                      }}
                    >
                      <View style={styles.replyAvatarColumn}>
                        <Pressable
                          onPress={() =>
                            onPressAuthor(reply.authorUserId, reply.author)
                          }
                          disabled={!reply.authorUserId}
                          hitSlop={8}
                        >
                          <CommentAuthorAvatar
                            profileImgUrl={reply.profileImgUrl}
                            size={REPLY_AVATAR_SIZE}
                          />
                        </Pressable>
                      </View>
                      <View style={styles.commentBody}>
                        <View style={styles.topRow}>
                          <View style={styles.metaRow}>
                            <Pressable
                              onPress={() =>
                                onPressAuthor(reply.authorUserId, reply.author)
                              }
                              disabled={!reply.authorUserId}
                              hitSlop={8}
                            >
                              <Text style={styles.replyAuthor}>
                                {reply.author}
                              </Text>
                            </Pressable>
                            {!!reply.createdAt && (
                              <Text style={styles.replyDate}>
                                {formatTimeAgo(reply.createdAt)}
                              </Text>
                            )}
                          </View>
                          {renderTopActions(reply)}
                        </View>

                        <Text style={styles.bodyText}>{reply.content}</Text>
                        {renderActions(reply, comment.id)}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ThreadedCommentList;
