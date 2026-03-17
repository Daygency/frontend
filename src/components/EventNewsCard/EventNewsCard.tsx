import React from "react";
import {
  Image,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
  Text,
} from "react-native";
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
  width = "100%",
  height = 193,
  containerStyle,
  onPress,
}: EventNewsCardProps) => {
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
      <Text style={styles.imageSpace} numberOfLines={1} ellipsizeMode="tail">
        {place}
      </Text>
      <Text style={styles.imageDate}>{dateRange}</Text>
    </Pressable>
  );
};

export default EventNewsCard;

