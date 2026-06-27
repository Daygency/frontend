import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLUE, GRAY, MAIN, RED, WHITE } from "../../../color";
import { formatPerformanceListDateLabel } from "../../../lib/news/formatPerformanceOpenLabel";
import { buildPerformanceNewsDisplay } from "../../../lib/news/buildPerformanceNewsDisplay";
import type { NewsListItem } from "../../../lib/apis/news/types";
import { pickNewsListThumbnailUrl } from "../../../lib/media/listThumbnailUrl";
import {
  createScrap,
  deleteScrapByTarget,
  getScraps,
} from "../../../lib/apis/scrap/scrapApi";
import { useAuth } from "../../../contexts/AuthContext";
import { useRequireLogin } from "../../../hooks/useRequireLogin";

type PerformanceNewsListCardProps = {
  item: NewsListItem;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const PerformanceNewsListCard = ({
  item,
  onPress,
  style,
}: PerformanceNewsListCardProps) => {
  const { user } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const [scraped, setScraped] = useState(false);

  const imageUrl = pickNewsListThumbnailUrl(item);
  const display = buildPerformanceNewsDisplay(item);
  const openLabel =
    display.openLabel ||
    formatPerformanceListDateLabel(item.startedAt, item.endedAt);

  useEffect(() => {
    if (!item.newsId) return;
    (async () => {
      const res = await getScraps({
        targetType: "NEWS",
        targetId: item.newsId,
      });
      if (!res) return;
      const myId = user?.socialId;
      setScraped(
        !!myId &&
          res.items.some((scrap) => String(scrap.user?.userId ?? "") === myId),
      );
    })();
  }, [item.newsId, user?.socialId]);

  const handleToggleScrap = async () => {
    if (!ensureLoggedIn()) return;
    if (!item.newsId) return;
    if (scraped) {
      const res = await deleteScrapByTarget({
        targetType: "NEWS",
        targetId: item.newsId,
      });
      if (!res.success) {
        Alert.alert("알림", "스크랩 취소에 실패했습니다.");
        return;
      }
      setScraped(false);
      return;
    }
    const created = await createScrap({
      targetType: "NEWS",
      targetId: item.newsId,
    });
    if (!created) {
      Alert.alert("알림", "스크랩에 실패했습니다.");
      return;
    }
    setScraped(true);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      onPress={onPress}
    >
      <View style={styles.posterWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]} />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Pressable
            hitSlop={10}
            onPress={(e) => {
              e.stopPropagation();
              void handleToggleScrap();
            }}
            style={styles.scrapButton}
          >
            <MaterialCommunityIcons
              name={scraped ? "bookmark" : "bookmark-outline"}
              size={22}
              color={scraped ? "#FFC107" : GRAY.DARK}
            />
          </Pressable>
        </View>

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

const POSTER_WIDTH = 112;
const POSTER_HEIGHT = 150;

const styles = StyleSheet.create({
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
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minWidth: 0,
  },
  scrapButton: {
    flexShrink: 0,
    marginTop: 2,
  },
  openTime: {
    fontSize: 15,
    fontWeight: "700",
    color: BLUE.DEFAULT,
    includeFontPadding: false,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: MAIN.DEFAULT,
    lineHeight: 24,
  },
  place: {
    fontSize: 14,
    color: GRAY.DARK_100,
    lineHeight: 20,
  },
  price: {
    fontSize: 13,
    color: GRAY.DARK,
    lineHeight: 18,
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
    fontSize: 11,
    fontWeight: "700",
  },
  hotBadge: {
    backgroundColor: "#FDE8E8",
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
});

export default PerformanceNewsListCard;
