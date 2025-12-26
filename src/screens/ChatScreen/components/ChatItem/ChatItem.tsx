import { Text, View } from "react-native";
import Tag from "../../../../components/Tag/Tag";
import styles from "./styles";

interface ChatItemProps {
  name: string;
  tag: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const ChatItem = ({
  name,
  tag,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
}: ChatItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            <Tag text={tag} />
          </View>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text style={styles.message} numberOfLines={1}>
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatItem;

