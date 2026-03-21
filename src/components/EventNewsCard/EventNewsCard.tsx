import React from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../ImageScrollView/styles";
import { GRAY } from "../../color";

/** 메인 화면 공연소식 섹션과 동일한 기본 이미지 */
export const DEFAULT_NEWS_IMAGE_URI =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s";

interface EventNewsCardProps {
  title: string;
  place: string;
  dateRange: string;
  imageUrl?: string;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  relativeTimeText?: string;
  showPlace?: boolean;
  showDate?: boolean;
  width?: number | string;
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const EventNewsCard = ({
  title,
  place,
  dateRange,
  imageUrl,
  likeCount,
  commentCount,
  viewCount,
  relativeTimeText,
  showPlace = true,
  showDate = true,
  width = "100%",
  height = 193,
  containerStyle,
  onPress,
}: EventNewsCardProps) => {
  const showCounts =
    likeCount != null || commentCount != null || viewCount != null;

  return (
    <Pressable
      style={[{ width }, containerStyle]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Image
        source={{ uri: imageUrl || DEFAULT_NEWS_IMAGE_URI }}
        style={[styles.image, { height }]}
        resizeMode="cover"
      />
      <Text style={styles.imageTitle} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
      {showPlace ? (
        <Text style={styles.imageSpace} numberOfLines={1} ellipsizeMode="tail">
          {place}
        </Text>
      ) : null}
      {showDate ? <Text style={styles.imageDate}>{dateRange}</Text> : null}
      {showCounts ? (
        <View style={localStyles.statsRow}>
          <View style={localStyles.statItem}>
            <Ionicons name="heart-outline" size={14} color={GRAY.DARK_100} />
            <Text style={localStyles.statText}>{likeCount ?? 0}</Text>
          </View>
          <View style={localStyles.statItem}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={14}
              color={GRAY.DARK_100}
            />
            <Text style={localStyles.statText}>{commentCount ?? 0}</Text>
          </View>
          <View style={localStyles.statItem}>
            <Ionicons name="eye-outline" size={14} color={GRAY.DARK_100} />
            <Text style={localStyles.statText}>{viewCount ?? 0}</Text>
            {relativeTimeText ? (
              <Text style={localStyles.statText}>{` \u00B7 ${relativeTimeText}`}</Text>
            ) : null}
          </View>
        </View>
      ) : null}
    </Pressable>
  );
};

const localStyles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statText: {
    fontSize: 12,
    color: GRAY.DARK_100,
  },
});

export default EventNewsCard;

