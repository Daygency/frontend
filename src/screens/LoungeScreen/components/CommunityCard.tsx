import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BLACK, GRAY } from "../../../color";
import CommentAuthorAvatar from "../../../components/comments/CommentAuthorAvatar/CommentAuthorAvatar";

type CommunityCardProps = {
  tag?: string;
  title: string;
  contentPreview: string;
  contentPreviewLines?: number;
  author?: string;
  date: string;
  likes: number;
  comments: number;
  scraps?: number;
  views?: number;
  profileImageUrl?: string;
  thumbnailUrl?: string;
  showNew?: boolean;
  onPress?: () => void;
};

const CommunityCard = ({
  title,
  contentPreview,
  contentPreviewLines = 0,
  author = "알수없음",
  date,
  likes,
  comments,
  profileImageUrl,
  thumbnailUrl,
  onPress,
}: CommunityCardProps) => {
  const titleText = title.trim();
  const contentText = contentPreview.trim();
  const showTitle = titleText.length > 0;
  const showContent =
    contentText.length > 0 && contentText !== titleText;
  const showMedia = Boolean(thumbnailUrl?.trim());
  const [textBlockHeight, setTextBlockHeight] = useState(0);
  const thumbSize = textBlockHeight > 0 ? textBlockHeight : 0;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <CommentAuthorAvatar
          profileImgUrl={profileImageUrl}
          size={40}
          style={styles.avatar}
        />

        <View style={[styles.body, showMedia && styles.bodyWithThumb]}>
          <View
            style={styles.textColumn}
            onLayout={(e) => {
              const next = Math.round(e.nativeEvent.layout.height);
              setTextBlockHeight((prev) => (prev === next ? prev : next));
            }}
          >
            <View style={styles.headerRow}>
              <Text style={styles.username} numberOfLines={1}>
                {author}
              </Text>
              {!!date && (
                <Text style={styles.timestamp} numberOfLines={1}>
                  {date}
                </Text>
              )}
            </View>

            {showTitle ? (
              <Text
                style={[styles.title, !showContent && styles.titleOnly]}
                numberOfLines={1}
              >
                {titleText}
              </Text>
            ) : null}

            {showContent ? (
              <Text
                style={styles.content}
                numberOfLines={
                  contentPreviewLines > 0 ? contentPreviewLines : 3
                }
              >
                {contentText}
              </Text>
            ) : null}

            <View style={styles.footer}>
              <View style={styles.footerItem}>
                <Ionicons name="heart-outline" size={12} color={BLACK} />
                <Text style={styles.footerText}>{likes}</Text>
              </View>
              <View style={styles.footerItem}>
                <Ionicons name="chatbubble-outline" size={12} color={BLACK} />
                <Text style={styles.footerText}>{comments}</Text>
              </View>
            </View>
          </View>

          {showMedia && thumbSize > 0 ? (
            <View
              style={[
                styles.thumbnailWrap,
                { width: thumbSize, height: thumbSize },
              ]}
            >
              <Image
                source={{ uri: thumbnailUrl! }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    marginRight: 12,
    flexShrink: 0,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  bodyWithThumb: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  username: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "400",
    color: GRAY.DARK_2,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: "400",
    color: GRAY.DARK_2,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: BLACK,
    lineHeight: 21,
    marginBottom: 2,
  },
  titleOnly: {
    marginBottom: 8,
  },
  content: {
    fontSize: 13,
    fontWeight: "400",
    color: GRAY.DARK_100,
    lineHeight: 18,
    marginBottom: 8,
  },
  thumbnailWrap: {
    flexShrink: 0,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: GRAY.MEDIUM,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: GRAY.MEDIUM,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "400",
    color: BLACK,
  },
});

export default CommunityCard;
