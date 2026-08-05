import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import SquircleView from "react-native-fast-squircle";
import UserProfileAvatar from "../../../../../components/ui/UserProfileAvatar";
import { getAnnouncementFirstImageUrl } from "../../../../../lib/announcement/getAnnouncementFirstImageUrl";
import styles from "./styles";

const MAIN_LOGO_IMAGE = require("../../../../../../assets/logo.png");

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
  /** 공고 단체 채팅방 여부 — true면 공고 사진(없으면 메인 로고)을 아바타로 사용 */
  isGroup?: boolean;
  /** 단체 채팅방이 속한 공고 ID */
  postId?: string;
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
  isGroup = false,
  postId,
}: ChatItemProps) => {
  const [announcementImageUrl, setAnnouncementImageUrl] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!isGroup || !postId) {
      setAnnouncementImageUrl(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const url = await getAnnouncementFirstImageUrl(postId);
      if (!cancelled) setAnnouncementImageUrl(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [isGroup, postId]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <SquircleView style={styles.avatar} cornerSmoothing={0.7}>
          {isGroup ? (
            <Image
              source={
                announcementImageUrl
                  ? { uri: announcementImageUrl }
                  : MAIN_LOGO_IMAGE
              }
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <UserProfileAvatar
              peerUserId={peerUserId}
              profileImgUrl={initialAvatarUrl}
              size={44}
              style={styles.avatarImage}
            />
          )}
        </SquircleView>
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
