import { StyleSheet, Text, View } from "react-native";
import { GRAY, BLACK } from "../../color";
import React from "react";

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
          <Text style={styles.latestPost}>{item.latestPost}</Text>
          {item.hasNew && <View style={styles.newDot} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 10,
    padding: 15,
    gap: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  boardName: {
    fontSize: 14,
    fontWeight: "600",
    color: BLACK,
  },
  spacer: {
    width: 10,
  },
  latestPost: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
    flex: 1,
  },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF0000",
    marginLeft: 4,
  },
});

export default GrayCard;