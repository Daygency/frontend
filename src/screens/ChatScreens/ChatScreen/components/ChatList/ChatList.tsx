import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ChatItem from "../ChatItem/ChatItem";
import { RootRoutes } from "../../../../../navigations/routes";
import type { ChatFilter } from "../../types";
import { Text } from "react-native";
import { useAuth } from "../../../../../contexts/AuthContext";
import {
  getAllRooms,
  getCoffeeRooms,
  getAppliedRooms,
  getMyAnnouncementGroupRooms,
} from "../../../../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../../../../lib/apis/chat/types";
import { formatChatListTime } from "../../../../../lib/chat/formatChatTime";
import { chatRoomItemToParams } from "../../../../../lib/chat/chatRoomNavigation";
import {
  CHAT_APPLIED_ROOMS_REFRESH,
  CHAT_ROOMS_REFRESH,
  CHAT_ROOM_UPDATED,
  type ChatRoomUpdatedPayload,
} from "../../../../../lib/chat/chatRoomsEvents";
import { matchesChatRoom } from "../../../../../lib/chat/chatSearch";
import EmptyState, {
  contentContainerWhenEmpty,
  emptyScreenStyle,
} from "../../../../../components/ui/EmptyState";
import { MAIN } from "../../../../../color";
import ChatRoomListSkeleton from "./ChatRoomListSkeleton";

type ChatTopTab = "전체" | "1:1" | "내 공고" | "지원 공고";

interface ChatListProps {
  topTab: ChatTopTab;
  filter?: ChatFilter;
  searchQuery?: string;
}

const ROOM_LIST_FETCHERS = {
  all: getAllRooms,
  coffee: getCoffeeRooms,
  applied: getAppliedRooms,
  myAnnouncements: getMyAnnouncementGroupRooms,
};

function ChatRoomsFlatList({
  mode,
  filter,
  searchQuery = "",
}: {
  mode: "all" | "coffee" | "applied" | "myAnnouncements";
  filter: ChatFilter;
  searchQuery?: string;
}) {
  const navigation = useNavigation<any>();
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<ChatRoomListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFirst = useCallback(async (opts?: { refresh?: boolean }) => {
    if (!isLoggedIn) {
      setItems([]);
      setCursor(null);
      setHasMore(false);
      setLoading(false);
      return;
    }
    if (!opts?.refresh) setLoading(true);
    const fn = ROOM_LIST_FETCHERS[mode];
    const res = await fn({ limit: 8 });
    if (res) {
      setItems(res.items);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } else {
      setItems([]);
      setCursor(null);
      setHasMore(false);
    }
    if (!opts?.refresh) setLoading(false);
  }, [isLoggedIn, mode]);

  useFocusEffect(
    useCallback(() => {
      void fetchFirst();
    }, [fetchFirst]),
  );

  /** README: 지원서 제출 후 `GET /chat/rooms/applied` 목록 동기화 (전체 탭에도 지원 공고 방이 섞여 있음) */
  useEffect(() => {
    if (mode !== "applied" && mode !== "all") return;
    const sub = DeviceEventEmitter.addListener(CHAT_APPLIED_ROOMS_REFRESH, () => {
      void fetchFirst();
    });
    return () => sub.remove();
  }, [mode, fetchFirst]);

  /** 방 읽음 처리 PATCH가 실제로 끝난 시점에 맞춰 재조회 — focus 재조회가 먼저 끝나 안읽음 뱃지가 남는 레이스 방지 */
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(CHAT_ROOMS_REFRESH, () => {
      void fetchFirst();
    });
    return () => sub.remove();
  }, [fetchFirst]);

  /** 소켓으로 새 메시지가 온 방을 목록에서 실시간으로 갱신(안읽음 +1, 미리보기, 맨 위로) */
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      CHAT_ROOM_UPDATED,
      (data: ChatRoomUpdatedPayload) => {
        setItems((prev) => {
          const idx = prev.findIndex((r) => r.id === data.chatRoomId);
          if (idx === -1) return prev;
          const current = prev[idx];
          const updated: ChatRoomListItem = data.message
            ? {
                ...current,
                unreadCount: (current.unreadCount ?? 0) + 1,
                lastMessage: {
                  content: data.message.content,
                  fileUrl: data.message.fileUrl ?? null,
                  fileName: data.message.fileName ?? null,
                  fileMime: data.message.fileMime ?? null,
                  fileItems: data.message.fileItems ?? null,
                  createdAt: data.message.createdAt,
                },
              }
            : current;
          const rest = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
          return [updated, ...rest];
        });
      },
    );
    return () => sub.remove();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFirst({ refresh: true });
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!isLoggedIn || !hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const fn = ROOM_LIST_FETCHERS[mode];
    const res = await fn({ cursor, limit: 8 });
    if (res) {
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  };

  const filteredItems = useMemo(() => {
    const base =
      filter === "안읽음"
        ? items.filter((item) => (item.unreadCount ?? 0) > 0)
        : items;
    const q = searchQuery.trim();
    if (!q) return base;
    return base.filter((item) => matchesChatRoom(item, q));
  }, [items, filter, searchQuery]);

  const openRoom = (room: ChatRoomListItem) => {
    const params = chatRoomItemToParams(room);
    if (room.kind !== "GROUP" && !params.peerUserId) {
      Alert.alert(
        "채팅방",
        "상대 정보를 불러오지 못했습니다. 앱을 다시 실행하거나 잠시 후 다시 시도해 주세요.",
      );
      return;
    }
    navigation.navigate(RootRoutes.CHAT_ROOM, params);
  };

  if (!isLoggedIn) {
    return (
      <View style={emptyScreenStyle}>
        <EmptyState message="로그인 후 채팅 목록을 불러올 수 있습니다." />
      </View>
    );
  }

  const isEmpty = filteredItems.length === 0 && !(loading && !refreshing);

  return (
    <FlatList
      style={{ flex: 1 }}
      data={filteredItems}
      keyExtractor={(r) => r.id}
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
          <ChatRoomListSkeleton />
        ) : (
          <EmptyState
            message={
              searchQuery.trim()
                ? "검색 결과가 없습니다."
                : filter === "안읽음"
                  ? "안읽은 채팅방이 없습니다."
                  : "채팅방이 없습니다."
            }
          />
        )
      }
      renderItem={({ item }) => {
        const peer = item.peer;
        const titleFromPost = item.post?.title;
        const displayName =
          item.kind === "GROUP" && titleFromPost
            ? titleFromPost
            : peer?.name ?? peer?.activityName ?? "채팅";
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
              isGroup={item.kind === "GROUP"}
              postId={item.post?.postId}
            />
          </Pressable>
        );
      }}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: "#F0F0F0" }} />
      )}
      contentContainerStyle={contentContainerWhenEmpty(isEmpty, {
        paddingBottom: 20,
      })}
    />
  );
}

const ChatList = ({ topTab, filter = "전체", searchQuery = "" }: ChatListProps) => {
  if (topTab === "내 공고") {
    return (
      <ChatRoomsFlatList
        mode="myAnnouncements"
        filter={filter}
        searchQuery={searchQuery}
      />
    );
  }

  if (topTab === "전체") {
    return (
      <ChatRoomsFlatList mode="all" filter={filter} searchQuery={searchQuery} />
    );
  }

  if (topTab === "1:1") {
    return (
      <ChatRoomsFlatList mode="coffee" filter={filter} searchQuery={searchQuery} />
    );
  }

  return (
    <ChatRoomsFlatList mode="applied" filter={filter} searchQuery={searchQuery} />
  );
};

export default ChatList;
