import { Text, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { GRAY } from "../../../../../color";
import styles from "./styles";

interface ChatItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isMusic?: boolean;
  isVerified?: boolean;
}

const ChatItem = ({
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
  isMusic = false,
  isVerified = false,
}: ChatItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <MaterialIcons name="account-circle" size={44} color={GRAY.MEDIUM_2} />
        </View>
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {isMusic ? (
              <View style={styles.badge}>
                <FontAwesome name="music" size={10} color="#FFFFFF" />
              </View>
            ) : isVerified ? (
              <View style={styles.badge}>
                <MaterialIcons name="verified" size={13} color="#FFFFFF" />
              </View>
            ) : null}
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

