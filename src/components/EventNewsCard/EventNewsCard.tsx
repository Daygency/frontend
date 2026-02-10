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
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { height }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[styles.image, { height, backgroundColor: GRAY.MEDIUM }]}
        />
      )}
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

