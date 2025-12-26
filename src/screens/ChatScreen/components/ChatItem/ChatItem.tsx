import { View, Text, Pressable } from "react-native";
import styles from "./styles";
import Tag from "../../../../components/Tag/Tag";

export interface ChatItemData {
  id: string;
  name: string;
  category: string;
  message: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  avatarInitial: string;
}

interface ChatItemProps {
  data: ChatItemData;
  onPress?: () => void;
}

const ChatItem = ({ data, onPress }: ChatItemProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{data.avatarInitial}</Text>
        </View>
        {data.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{data.name}</Text>
            <Tag text={data.category} variant="type" />
          </View>
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>{data.timestamp}</Text>
            {data.unreadCount && data.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{data.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {data.message}
        </Text>
      </View>
    </Pressable>
  );
};

export default ChatItem;

