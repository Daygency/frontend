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
        <View key={index} style={styles.item}>
          <Text style={styles.boardName}>{item.boardName}</Text>
          <View style={styles.spacer} />
          <View style={styles.latestPostWrap}>
            <Text style={styles.latestPost}>{item.latestPost}</Text>
            {item.hasNew && <View style={styles.newDot} />}
          </View>
        </View>
      ))}
    </View>
  );
};

export default GrayCard;