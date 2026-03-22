import React from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Text,
  type DimensionValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../ImageScrollView/styles";
import { GRAY } from "../../color";

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
  const hasImage = Boolean(imageUrl?.trim());

  return (
    <Pressable
      style={[{ width: width as DimensionValue }, containerStyle]}
      onPress={onPress}
      disabled={!onPress}
    >
      {hasImage ? (
        <Image
          source={{ uri: imageUrl! }}
          style={[styles.image, { height }]}
          resizeMode="cover"
        />
      ) : null}
      <Text
        style={[styles.imageTitle, !hasImage && localStyles.titleNoImage]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
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
  titleNoImage: {
    marginTop: 0,
  },
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

