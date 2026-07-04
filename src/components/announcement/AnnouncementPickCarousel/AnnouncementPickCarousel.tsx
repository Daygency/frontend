import { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import type { AnnouncementPickItem } from "../../../lib/apis/announcement-pick/announcementPickApi";
import {
  calendarDaysUntilDeadline,
  formatAnnouncementDDayLabel,
} from "../../../lib/announcement/announcementDeadline";

const { width: screenWidth } = Dimensions.get("window");
const BLACK_LOGO = require("../../../../assets/daygency_logo_black.png");
const CARD_WIDTH = screenWidth - 24;
const CARD_HEIGHT = 132;
const ITEM_WIDTH = screenWidth;
const SIDE_INSET = 12;

type AnnouncementPickCarouselProps = {
  items: AnnouncementPickItem[];
  onPressItem?: (item: AnnouncementPickItem) => void;
};

function AnnouncementPickCard({
  item,
  index,
  total,
  onPress,
}: {
  item: AnnouncementPickItem;
  index: number;
  total: number;
  onPress?: () => void;
}) {
  const daysLeft = calendarDaysUntilDeadline(item.deadlineAt) ?? 0;
  const dDayLabel = formatAnnouncementDDayLabel(
    daysLeft,
    daysLeft < 0 ? "모집마감" : "모집중",
    false,
    item.deadlineAt,
  );

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={["rgba(0,0,0,0.48)", "rgba(0,0,0,0.62)", "rgba(0,0,0,0.88)"]}
        locations={[0, 0.38, 1]}
        style={styles.overlay}
      />
      <View style={styles.topRow}>
        <Text style={styles.organizer} numberOfLines={1}>
          {item.organizerName}
        </Text>
        <Text style={styles.dDay}>{dDayLabel}</Text>
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.footerRow}>
          <View style={styles.keywordRow}>
            {item.keywords.slice(0, 4).map((keyword) => (
              <View key={`${item.pickId}-${keyword}`} style={styles.keywordChip}>
                <Text style={styles.keywordText} numberOfLines={1}>
                  {keyword}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.pageText}>
            {index + 1} / {total}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function AnnouncementPickCarousel({
  items,
  onPressItem,
}: AnnouncementPickCarouselProps) {
  const data = useMemo(() => items.slice(0, 10), [items]);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (data.length === 0) return null;

  return (
    <View>
      <Carousel
        width={ITEM_WIDTH}
        height={CARD_HEIGHT}
        data={data}
        loop={data.length > 1}
        autoPlay={data.length > 1}
        autoPlayInterval={4200}
        pagingEnabled
        snapEnabled
        style={styles.carousel}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 24,
          parallaxAdjacentItemScale: 0.94,
        }}
        onSnapToItem={setCurrentIndex}
        renderItem={({ item, index }) => (
          <View style={styles.slideWrap}>
            <AnnouncementPickCard
              item={item}
              index={data.length > 1 ? currentIndex : index}
              total={data.length}
              onPress={() => onPressItem?.(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLogo: {
    width: 22,
    height: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E2430",
  },
  carousel: {
    overflow: "visible",
  },
  slideWrap: {
    width: ITEM_WIDTH,
    height: CARD_HEIGHT,
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#10131A",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topRow: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  organizer: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    // lineHeight: 18,
    fontWeight: "500",
  },
  dDay: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomContent: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
    minHeight: 56,
    justifyContent: "flex-end",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 26,
    letterSpacing: -0.2,
    fontWeight: "600",
    marginBottom: 8,
  },
  keywordRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    minWidth: 0,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  keywordChip: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    backgroundColor: "rgba(0,0,0,0.16)",
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  keywordText: {
    color: "#FFFFFF",
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
    fontWeight: "400",
  },
  pageText: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    flexShrink: 0,
  },
});
