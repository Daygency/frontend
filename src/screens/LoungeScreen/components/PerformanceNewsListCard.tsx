import { memo, useCallback } from "react";
import { Image, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLUE, GRAY, MAIN, RED, WHITE, lightDark } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { formatPerformanceListDateLabel } from "../../../lib/news/formatPerformanceOpenLabel";
import { buildPerformanceNewsDisplay } from "../../../lib/news/buildPerformanceNewsDisplay";
import type { NewsListItem } from "../../../lib/apis/news/types";
import { pickNewsListThumbnailUrl } from "../../../lib/media/listThumbnailUrl";

type PerformanceNewsListCardProps = {
  item: NewsListItem;
  onPress?: (newsId: string) => void;
  style?: StyleProp<ViewStyle>;
};

const PerformanceNewsListCard = ({
  item,
  onPress,
  style,
}: PerformanceNewsListCardProps) => {
  const imageUrl = pickNewsListThumbnailUrl(item);
  const display = buildPerformanceNewsDisplay(item);
  const openLabel =
    display.openLabel ||
    formatPerformanceListDateLabel(item.startedAt, item.endedAt);
  const handlePress = useCallback(() => {
    onPress?.(item.newsId);
  }, [onPress, item.newsId]);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      onPress={handlePress}
    >
      <View style={styles.posterWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]} />
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {openLabel ? (
          <View style={styles.timeRow}>
            <Text style={styles.openTime}>{openLabel}</Text>
            {display.hasMultipleSessions ? (
              <MaterialCommunityIcons
                name="chevron-down"
                size={18}
                color={BLUE.DEFAULT}
              />
            ) : null}
          </View>
        ) : null}

        <Text style={styles.place} numberOfLines={1}>
          {item.place}
        </Text>
        {display.priceLabel ? (
          <Text style={styles.price}>{display.priceLabel}</Text>
        ) : null}

        {display.isHot || display.isExclusive ? (
          <View style={styles.badgeRow}>
            {display.isHot ? (
              <View style={[styles.badge, styles.hotBadge]}>
                <Text style={[styles.badgeText, styles.hotBadgeText]}>HOT</Text>
              </View>
            ) : null}
            {display.isExclusive ? (
              <View style={[styles.badge, styles.exclusiveBadge]}>
                <Text style={[styles.badgeText, styles.exclusiveBadgeText]}>
                  단독판매
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const POSTER_WIDTH = 96;
const POSTER_HEIGHT = 128;

const styles = themedStyles(() => ({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
  },
  pressed: {
    opacity: 0.85,
  },
  posterWrap: {
    width: POSTER_WIDTH,
    flexShrink: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    overflow: "hidden",
    backgroundColor: GRAY.DEFAULT,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    backgroundColor: GRAY.MEDIUM,
  },
  posterPlaceholder: {
    backgroundColor: GRAY.MEDIUM_2,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minWidth: 0,
  },
  openTime: {
    fontSize: 13,
    fontWeight: "700",
    color: BLUE.DEFAULT,
    includeFontPadding: false,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    lineHeight: 20,
  },
  place: {
    fontSize: 13,
    color: GRAY.DARK_100,
    lineHeight: 18,
  },
  price: {
    fontSize: 12,
    color: GRAY.DARK,
    lineHeight: 16,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  hotBadge: {
    backgroundColor: lightDark("#FDE8E8", "#3A1F22"),
  },
  hotBadgeText: {
    color: RED.DEFAULT,
  },
  exclusiveBadge: {
    backgroundColor: BLUE.LIGHT_1,
  },
  exclusiveBadgeText: {
    color: BLUE.DEFAULT,
  },
}));

export default memo(PerformanceNewsListCard);
