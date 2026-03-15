import { Text, View } from "react-native";
import React from "react";
import styles from "./styles";

interface CommunityItem {
  boardName: string;
  latestPost: string;
  hasNew?: boolean;
}

interface GrayCardProps {
  items: CommunityItem[];
}

const GrayCard = ({ items }: GrayCardProps) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.item,
            index === items.length - 1 && styles.itemLast,
          ]}
        >
          <Text style={styles.boardName}>{item.boardName}</Text>
          <View style={styles.latestPostWrap}>
            <Text style={styles.latestPost} numberOfLines={1}>
              {item.latestPost}
            </Text>
            {item.hasNew && <View style={styles.newDot} />}
          </View>
        </View>
      ))}
    </View>
  );
};

export default GrayCard;