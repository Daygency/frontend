import React from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TextStyle,
  type DimensionValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../media/ImageScrollView/styles";
import { GRAY } from "../../../color";
import NewBadge from "../../ui/NewBadge";

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
  showNew?: boolean;
  width?: number | string;
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
  /** 기본 텍스트 크기(제목/장소/날짜)를 이 카드 호출부에서만 덮어쓰고 싶을 때 사용 */
  titleStyle?: StyleProp<TextStyle>;
  placeStyle?: StyleProp<TextStyle>;
  dateStyle?: StyleProp<TextStyle>;
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
  showNew = false,
  width = "100%",
  height = 193,
  containerStyle,
  titleStyle,
  placeStyle,
  dateStyle,
  onPress,
}: EventNewsCardProps) => {
  const showCounts =
    likeCount != null || commentCount != null || viewCount != null;
  const hasImage = Boolean(imageUrl?.trim());
  const logoSize = Math.round(Math.min(56, Math.max(32, height * 0.26)));

  return (
    <Pressable
      style={[{ width: width as DimensionValue }, containerStyle]}
      onPress={onPress}
      disabled={!onPress}
    >
      {hasImage ? (
        <View style={[localStyles.imageWrap, { height }]}>
          <Image
            source={{ uri: imageUrl! }}
            style={[styles.image, localStyles.imageFill]}
            resizeMode="cover"
          />
          {showNew ? <NewBadge style={localStyles.newBadge} /> : null}
        </View>
      ) : (
        <View
          style={[styles.image, localStyles.noImagePlaceholder, { height }]}
          accessibilityRole="image"
          accessibilityLabel="이미지 없음"
        >
          <Image
            source={require("../../../../assets/logo.png")}
            style={{ width: logoSize, height: logoSize }}
            resizeMode="contain"
          />
          {showNew ? <NewBadge style={localStyles.newBadge} /> : null}
        </View>
      )}
      <Text
        style={[styles.imageTitle, titleStyle]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      {showPlace ? (
        <Text
          style={[styles.imageSpace, placeStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {place}
        </Text>
      ) : null}
      {showDate ? (
        <Text style={[styles.imageDate, dateStyle]}>{dateRange}</Text>
      ) : null}
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
  imageWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    backgroundColor: GRAY.DEFAULT,
  },
  imageFill: {
    width: "100%",
    height: "100%",
  },
  newBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  noImagePlaceholder: {
    backgroundColor: GRAY.MEDIUM,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
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

