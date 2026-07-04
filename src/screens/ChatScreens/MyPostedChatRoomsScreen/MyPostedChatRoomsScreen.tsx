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
import AnnouncementCard from "../../../components/cards/AnnouncementCard";
import EmptyState, { contentContainerWhenEmpty } from "../../../components/ui/EmptyState";
import styles from "./styles";
import { RootRoutes } from "../../../navigations/routes";
import { getRoomsByPost } from "../../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../../lib/apis/chat/types";
import type { AnnouncementListItem } from "../../../lib/apis/announcement/types";
import { formatChatListTime } from "../../../lib/chat/formatChatTime";
import { chatRoomItemToParams } from "../../../lib/chat/chatRoomNavigation";
import { resolveAnnouncementAuthorLabel } from "../../../lib/announcement/announcementAuthor";
import { announcementListRecruitmentStatus } from "../../../lib/announcement/announcementListStatus";
import { parseAnnouncementDaysLeft } from "../../../lib/announcement/parseAnnouncementDaysLeft";
import { MAIN } from "../../../color";

type Params = {
  announcement: AnnouncementListItem;
};

type RouteParams = RouteProp<{ MyPostedChatRooms: Params }, "MyPostedChatRooms">;

export default function MyPostedChatRoomsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteParams>();
  const { announcement } = route.params;
  const postId = announcement.postId;

  const [rooms, setRooms] = useState<ChatRoomListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFirst = useCallback(async (opts?: { refresh?: boolean }) => {
    if (!postId) {
      setRooms([]);
      setLoading(false);
      return;
    }
    if (!opts?.refresh) setLoading(true);
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
    if (!opts?.refresh) setLoading(false);
  }, [postId]);

  useFocusEffect(
    useCallback(() => {
      void fetchFirst();
    }, [fetchFirst]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFirst({ refresh: true });
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

  const openAnnouncementDetail = useCallback(() => {
    navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
      title: announcement.title,
      type: announcement.type,
      status: announcementListRecruitmentStatus(announcement),
      daysLeft: parseAnnouncementDaysLeft(announcement.dDay),
      postId: announcement.postId,
      viewCount: announcement.viewCount,
    });
  }, [navigation, announcement]);

  const announcementCard = (
    <View style={styles.announcementCardWrap}>
      <AnnouncementCard
        title={announcement.title}
        type={announcement.type}
        status={announcementListRecruitmentStatus(announcement)}
        daysLeft={parseAnnouncementDaysLeft(announcement.dDay)}
        deadlineAt={announcement.deadlineAt}
        completed={announcement.completed}
        viewCount={announcement.viewCount}
        priceType={announcement.priceType}
        price={announcement.price}
        address={announcement.address}
        authorName={resolveAnnouncementAuthorLabel(announcement.user)}
        profileImgUrl={announcement.user?.profileImgUrl}
        onPress={openAnnouncementDetail}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {announcementCard}

      <Text style={styles.roomsCountLabel}>
        채팅방 {rooms.length}
        {hasMore ? " · 더 불러오기" : ""}
      </Text>

      <FlatList
        style={{ flex: 1 }}
        data={rooms}
        keyExtractor={(i) => i.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MAIN.DEFAULT}
            colors={[MAIN.DEFAULT]}
          />
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
          loading && !refreshing ? (
            <View style={{ paddingVertical: 48, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#1F2A44" />
            </View>
          ) : (
            <EmptyState message="이 공고에 열린 채팅방이 없습니다." />
          )
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
                unreadCount={item.unreadCount ?? 0}
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
        contentContainerStyle={contentContainerWhenEmpty(
          rooms.length === 0,
          styles.listContent,
        )}
      />
    </View>
  );
}
