import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  type GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BLACK, GRAY, RED, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import CommentAuthorAvatar from "../../../components/comments/CommentAuthorAvatar/CommentAuthorAvatar";
import PhotoGrid from "../../../components/media/PhotoGrid";
import { useRequireLogin } from "../../../hooks/useRequireLogin";
import { followUser, unfollowUser } from "../../../lib/apis/follow/followApi";
import { createLike, deleteLikeByTarget } from "../../../lib/apis/like/likeApi";
import {
  createScrap,
  deleteScrapByTarget,
} from "../../../lib/apis/scrap/scrapApi";

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
  showAvatar?: boolean;
  thumbnailUrl?: string;
  /** 여러 장 첨부 — 지정 시 목록에서도 상세 페이지와 동일한 사진 그리드로 표시 */
  images?: string[];
  showNew?: boolean;
  /** 지정 시 팔로우/스크랩이 붙은 커뮤니티 피드 카드 레이아웃으로 렌더링 */
  communityId?: string;
  authorUserId?: string;
  isOwnPost?: boolean;
  onPress?: () => void;
  onPressAuthor?: () => void;
};

const THUMBNAIL_SIZE = 72;

const CommunityCard = ({
  title,
  contentPreview,
  contentPreviewLines = 0,
  author = "알수없음",
  date,
  likes,
  comments,
  scraps,
  views,
  profileImageUrl,
  showAvatar = true,
  thumbnailUrl,
  images,
  communityId,
  authorUserId,
  isOwnPost,
  onPress,
  onPressAuthor,
}: CommunityCardProps) => {
  const { ensureLoggedIn } = useRequireLogin();
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [scraped, setScraped] = useState(false);
  const [scrapLoading, setScrapLoading] = useState(false);
  const [scrapCount, setScrapCount] = useState(scraps ?? 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const titleText = title.trim();
  const contentText = contentPreview.trim();
  const showTitle = titleText.length > 0;
  const showContent = contentText.length > 0 && contentText !== titleText;

  const handlePressAuthor = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onPressAuthor?.();
  };

  const isFeedCard = Boolean(communityId);
  const galleryImages =
    images && images.length > 0
      ? images
      : thumbnailUrl?.trim()
        ? [thumbnailUrl]
        : [];
  const showFollowButton = isFeedCard && Boolean(authorUserId) && !isOwnPost;

  const handlePressFollow = async (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (!ensureLoggedIn()) return;
    if (!authorUserId || followLoading) return;
    setFollowLoading(true);
    try {
      if (following) {
        const res = await unfollowUser(authorUserId);
        if (res.ok) setFollowing(false);
      } else {
        const res = await followUser(authorUserId);
        if (res.ok) setFollowing(true);
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const handlePressLike = async (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (!ensureLoggedIn()) return;
    if (!communityId || likeLoading) return;
    setLikeLoading(true);
    try {
      if (liked) {
        const res = await deleteLikeByTarget({
          likeType: "COMMUNITY",
          targetId: communityId,
        });
        if (res.success) {
          setLiked(false);
          setLikeCount((c) => Math.max(0, c - 1));
        }
      } else {
        const created = await createLike({
          likeType: "COMMUNITY",
          targetId: communityId,
        });
        if (created) {
          setLiked(true);
          setLikeCount((c) => c + 1);
        }
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handlePressScrap = async (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (!ensureLoggedIn()) return;
    if (!communityId || scrapLoading) return;
    setScrapLoading(true);
    try {
      if (scraped) {
        const res = await deleteScrapByTarget({
          targetType: "COMMUNITY",
          targetId: communityId,
        });
        if (res.success) {
          setScraped(false);
          setScrapCount((c) => Math.max(0, c - 1));
        }
      } else {
        const created = await createScrap({
          targetType: "COMMUNITY",
          targetId: communityId,
        });
        if (created) {
          setScraped(true);
          setScrapCount((c) => c + 1);
        }
      }
    } finally {
      setScrapLoading(false);
    }
  };

  if (isFeedCard) {
    return (
      <Pressable style={styles.container} onPress={onPress}>
        <View style={styles.feedHeaderRow}>
          <Pressable
            style={styles.feedAuthorLeft}
            onPress={handlePressAuthor}
            disabled={!onPressAuthor}
            hitSlop={8}
          >
            <CommentAuthorAvatar
              profileImgUrl={profileImageUrl}
              size={32}
              style={styles.feedAvatar}
            />
            <View style={styles.feedAuthorTextCol}>
              <Text style={styles.feedAuthorName} numberOfLines={1}>
                {author}
              </Text>
              {!!date && (
                <Text style={styles.feedAuthorMeta} numberOfLines={1}>
                  {date}
                </Text>
              )}
            </View>
          </Pressable>

          {showFollowButton ? (
            <Pressable
              style={[
                styles.followBtn,
                following && styles.followBtnActive,
              ]}
              onPress={handlePressFollow}
              disabled={followLoading}
              hitSlop={8}
            >
              <Text
                style={[
                  styles.followBtnText,
                  following && styles.followBtnTextActive,
                ]}
              >
                {following ? "팔로잉" : "팔로우"}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {showTitle ? (
          <Text style={styles.feedTitle} numberOfLines={1}>
            {titleText}
          </Text>
        ) : null}

        {showContent ? (
          <Text
            style={styles.feedContent}
            numberOfLines={contentPreviewLines > 0 ? contentPreviewLines : 3}
          >
            {contentText}
          </Text>
        ) : null}

        {galleryImages.length > 0 ? (
          <View style={styles.feedMediaWrap}>
            <PhotoGrid images={galleryImages} onPress={() => onPress?.()} />
          </View>
        ) : null}

        <View style={[styles.footer, styles.feedFooter]}>
          <View style={styles.footerLeft}>
            <Pressable
              style={styles.footerItemLarge}
              onPress={handlePressLike}
              disabled={likeLoading}
              hitSlop={8}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={17}
                color={liked ? RED.DEFAULT : GRAY.DARK_100}
              />
              <Text style={styles.footerTextLarge}>{likeCount}</Text>
            </Pressable>
            <Pressable style={styles.footerItemLarge} onPress={onPress} hitSlop={8}>
              <Ionicons name="chatbubble-outline" size={17} color={GRAY.DARK_100} />
              <Text style={styles.footerTextLarge}>{comments}</Text>
            </Pressable>
            <Pressable
              style={styles.footerItemLarge}
              onPress={handlePressScrap}
              disabled={scrapLoading}
              hitSlop={8}
            >
              <Ionicons
                name={scraped ? "bookmark" : "bookmark-outline"}
                size={17}
                color={GRAY.DARK_100}
              />
              <Text style={styles.footerTextLarge}>{scrapCount}</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  const showMedia = Boolean(thumbnailUrl?.trim());

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        {showAvatar ? (
          <Pressable
            onPress={handlePressAuthor}
            disabled={!onPressAuthor}
            hitSlop={8}
          >
            <CommentAuthorAvatar
              profileImgUrl={profileImageUrl}
              size={40}
              style={styles.avatar}
            />
          </Pressable>
        ) : null}

        <View style={[styles.body, showMedia && styles.bodyWithThumb]}>
          <View style={styles.textColumn}>
            <View style={styles.headerRow}>
              {showAvatar ? (
                <Text
                  style={[styles.username, styles.usernamePressable]}
                  numberOfLines={1}
                >
                  {author}
                </Text>
              ) : (
                <Pressable
                  onPress={handlePressAuthor}
                  disabled={!onPressAuthor}
                  hitSlop={8}
                >
                  <Text
                    style={[styles.username, styles.usernamePressable]}
                    numberOfLines={1}
                  >
                    {author}
                  </Text>
                </Pressable>
              )}
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
              <View style={styles.footerLeft}>
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
          </View>

          {showMedia ? (
            <View style={styles.thumbnailWrap}>
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

const styles = themedStyles(() => ({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.DARK_1,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    marginRight: 12,
    flexShrink: 0,
    borderRadius: 15,
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
    fontSize: 12,
    fontWeight: "400",
    color: GRAY.DARK_2,
  },
  usernamePressable: {
    flexShrink: 1,
    minWidth: 0,
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
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
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
    justifyContent: "space-between",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
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
    minWidth: 12,
    fontVariant: ["tabular-nums"],
  },
  footerItemLarge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerTextLarge: {
    fontSize: 12,
    fontWeight: "400",
    color: GRAY.DARK_100,
    minWidth: 12,
    fontVariant: ["tabular-nums"],
  },

  // ── 피드 카드(커뮤니티 목록) 전용 스타일 ──
  feedHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feedAuthorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
  },
  feedAvatar: {
    marginRight: 8,
    flexShrink: 0,
    borderRadius: 12,
  },
  feedAuthorTextCol: {
    marginLeft: 0,
    flexShrink: 1,
    minWidth: 0,
  },
  feedAuthorName: {
    fontSize: 14,
    fontWeight: "700",
    color: BLACK,
  },
  feedAuthorMeta: {
    fontSize: 12,
    fontWeight: "400",
    color: GRAY.DARK_2,
    marginTop: 2,
  },
  followBtn: {
    flexShrink: 0,
    marginLeft: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: GRAY.MEDIUM,
  },
  followBtnActive: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.DARK_1,
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: GRAY.DARK_100,
  },
  followBtnTextActive: {
    color: GRAY.DARK_100,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BLACK,
    lineHeight: 21,
    marginBottom: 4,
  },
  feedContent: {
    fontSize: 13,
    fontWeight: "400",
    color: GRAY.DARK_100,
    lineHeight: 18,
    marginBottom: 8,
  },
  feedMediaWrap: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 4,
    // PhotoGrid 타일의 내부 padding(3px)만큼 밀어내어 사진 가장자리가 제목/본문 텍스트와 같은 좌우 여백에 맞춰지도록 함
    marginHorizontal: -3,
  },
  feedFooter: {
    marginTop: 8,
  },
}));

export default CommunityCard;
