import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import ChatItem from "../ChatScreen/components/ChatItem/ChatItem";
import styles from "./styles";
import { RootRoutes } from "../../../navigations/routes";
import { getRoomsByPost } from "../../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../../lib/apis/chat/types";
import { formatChatListTime } from "../../../lib/chat/formatChatTime";
import { chatRoomItemToParams } from "../../../lib/chat/chatRoomNavigation";
import { shouldShowAnnouncementDDayChip } from "../../../lib/announcement/announcementDeadline";

type Params = {
  postId: string;
  title: string;
  typeTag?: string;
  statusTag?: string;
  dDay?: string;
};

type RouteParams = RouteProp<{ MyPostedChatRooms: Params }, "MyPostedChatRooms">;

export default function MyPostedChatRoomsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteParams>();
  const { postId, title, typeTag, statusTag, dDay } = route.params;
  const showDDayChip = shouldShowAnnouncementDDayChip(
    statusTag === "모집중",
    dDay,
  );

  const [rooms, setRooms] = useState<ChatRoomListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFirst = useCallback(async () => {
    if (!postId) {
      setRooms([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await getRoomsByPost(postId, { limit: 30 });
    if (res) {
      setRooms(res.items);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } else {
      setRooms([]);
      setCursor(null);
      setHasMore(false);
    }
    setLoading(false);
  }, [postId]);

  useFocusEffect(
    useCallback(() => {
      void fetchFirst();
    }, [fetchFirst]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFirst();
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const res = await getRoomsByPost(postId, { cursor, limit: 30 });
    if (res) {
      setRooms((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  };

  const openRoom = (room: ChatRoomListItem) => {
    const params = chatRoomItemToParams(room);
    if (!params.peerUserId) {
      Alert.alert(
        "채팅방",
        "상대 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
      return;
    }
    navigation.navigate(RootRoutes.CHAT_ROOM, params);
  };

  if (loading && rooms.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#1F2A44" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.postCard}>
        <View style={styles.postThumb} />
        <View style={styles.postContent}>
          <Text style={styles.postTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.postTagsRow}>
            {typeTag ? (
              <View style={[styles.tagChip, styles.tagChipOrange]}>
                <Text style={[styles.tagText, styles.tagTextOrange]}>{typeTag}</Text>
              </View>
            ) : null}
            {statusTag ? (
              <View style={[styles.tagChip, styles.tagChipGray]}>
                <Text style={[styles.tagText, styles.tagTextGray]}>{statusTag}</Text>
              </View>
            ) : null}
            {showDDayChip ? (
              <View style={[styles.tagChip, styles.tagChipNavy]}>
                <Text style={[styles.tagText, styles.tagTextNavy]}>{dDay}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <Text style={styles.roomsCountLabel}>
        채팅방 {rooms.length}
        {hasMore ? " · 더 불러오기" : ""}
      </Text>

      <FlatList
        style={{ flex: 1 }}
        data={rooms}
        keyExtractor={(i) => i.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator color="#1F2A44" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 24, alignItems: "center" }}>
            <Text style={{ color: "#888", textAlign: "center" }}>
              이 공고에 열린 채팅방이 없습니다.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const peer = item.peer;
          const displayName =
            peer?.name ?? peer?.activityName ?? "지원자";
          const last = item.lastMessage?.content ?? "";
          const ts = formatChatListTime(item.lastMessage?.createdAt);
          return (
            <Pressable onPress={() => openRoom(item)}>
              <ChatItem
                name={displayName}
                lastMessage={last}
                timestamp={ts}
                unreadCount={0}
                isOnline={false}
                isMusic={false}
                isVerified={false}
                variant="default"
                peerUserId={peer?.userId}
                initialAvatarUrl={peer?.profileImageUrl}
              />
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.listContent,
          rooms.length === 0 && { flexGrow: 1, justifyContent: "center" },
        ]}
      />
    </View>
  );
}
