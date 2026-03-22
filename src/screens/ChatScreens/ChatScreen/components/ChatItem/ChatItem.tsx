import { Text, View, Image } from "react-native";
import { useState, useEffect } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { GRAY } from "../../../../../color";
import { usePeerAvatarUrl } from "../../../../../lib/chat/usePeerAvatarUrl";
import styles from "./styles";

interface ChatItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isMusic?: boolean;
  isVerified?: boolean;
  variant?: "default";
  /** 상대 userId — 이미지 URL이 없을 때 공개 프로필로 보조 조회 */
  peerUserId?: string;
  /** API에서 온 원본 프로필 이미지 URL(상대경로 가능) */
  initialAvatarUrl?: string;
}

const ChatItem = ({
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
  isMusic = false,
  isVerified = false,
  peerUserId,
  initialAvatarUrl,
}: ChatItemProps) => {
  const avatarUrl = usePeerAvatarUrl(peerUserId, initialAvatarUrl);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setImgErr(false);
  }, [avatarUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {avatarUrl && !imgErr ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <MaterialIcons name="person" size={28} color={GRAY.MEDIUM_2} />
          )}
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
