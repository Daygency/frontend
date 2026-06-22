import { Pressable, Text, View } from "react-native";
import NewBadge from "../../ui/NewBadge";
import styles from "./styles";

export interface CommunityItem {
  boardName: string;
  latestPost: string;
  communityId?: string;
  hasNew?: boolean;
}

interface GrayCardProps {
  items: CommunityItem[];
  onPressItem?: (communityId: string) => void;
}

const GrayCard = ({ items, onPressItem }: GrayCardProps) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const isPressable = Boolean(item.communityId && onPressItem);

        return (
          <Pressable
            key={item.communityId ?? `${item.boardName}-${index}`}
            disabled={!isPressable}
            onPress={() => {
              if (item.communityId && onPressItem) {
                onPressItem(item.communityId);
              }
            }}
            style={({ pressed }) => [
              styles.item,
              index === items.length - 1 && styles.itemLast,
              pressed && isPressable && styles.itemPressed,
            ]}
          >
            <View style={styles.boardNameWrap}>
              <Text style={styles.boardName}>{item.boardName}</Text>
            </View>
            <View style={styles.latestPostWrap}>
              <Text style={styles.latestPost} numberOfLines={1}>
                {item.latestPost}
              </Text>
              {item.hasNew ? <NewBadge /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default GrayCard;
