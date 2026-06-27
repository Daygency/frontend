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
import { getCoffeeRooms, getAppliedRooms } from "../../../../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../../../../lib/apis/chat/types";
import { getMyAnnouncementList } from "../../../../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../../../../lib/apis/announcement/types";
import { formatChatListTime } from "../../../../../lib/chat/formatChatTime";
import { chatRoomItemToParams } from "../../../../../lib/chat/chatRoomNavigation";
import { CHAT_APPLIED_ROOMS_REFRESH } from "../../../../../lib/chat/chatRoomsEvents";
import { matchesAnnouncement, matchesChatRoom } from "../../../../../lib/chat/chatSearch";
import EmptyState, {
  contentContainerWhenEmpty,
  emptyScreenStyle,
} from "../../../../../components/ui/EmptyState";
import MyAnnouncementListItem from "./MyAnnouncementListItem";

type ChatTopTab = "일반" | "내 공고" | "지원 공고";

/** 탭별 안읽음 배지 — 서버에 unread 필드 없음 */
export function getUnreadCountByTopTabMock(_topTab: ChatTopTab): number {
  return 0;
}

interface ChatListProps {
  topTab: ChatTopTab;
  filter?: ChatFilter;
  searchQuery?: string;
}

function ChatRoomsFlatList({
  mode,
  filter,
  searchQuery = "",
}: {
  mode: "coffee" | "applied";
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

  const fetchFirst = useCallback(async () => {
    if (!isLoggedIn) {
      setItems([]);
      setCursor(null);
      setHasMore(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const fn = mode === "coffee" ? getCoffeeRooms : getAppliedRooms;
    const res = await fn({ limit: 30 });
    if (res) {
      setItems(res.items);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } else {
      setItems([]);
      setCursor(null);
      setHasMore(false);
    }
    setLoading(false);
  }, [isLoggedIn, mode]);

  useFocusEffect(
    useCallback(() => {
      void fetchFirst();
    }, [fetchFirst]),
  );

  /** README: 지원서 제출 후 `GET /chat/rooms/applied` 목록 동기화 */
  useEffect(() => {
    if (mode !== "applied") return;
    const sub = DeviceEventEmitter.addListener(CHAT_APPLIED_ROOMS_REFRESH, () => {
      void fetchFirst();
    });
    return () => sub.remove();
  }, [mode, fetchFirst]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFirst();
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!isLoggedIn || !hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const fn = mode === "coffee" ? getCoffeeRooms : getAppliedRooms;
    const res = await fn({ cursor, limit: 30 });
    if (res) {
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  };

  const filteredItems = useMemo(() => {
    if (filter === "안읽음") return [];
    const q = searchQuery.trim();
    if (!q) return items;
    return items.filter((item) => matchesChatRoom(item, q));
  }, [items, filter, searchQuery]);

  const openRoom = (room: ChatRoomListItem) => {
    const params = chatRoomItemToParams(room);
    if (!params.peerUserId) {
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

  if (loading && items.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1F2A44" />
      </View>
    );
  }

  if (filter === "안읽음") {
    return (
      <View style={emptyScreenStyle}>
        <EmptyState message="안읽음 필터는 서버 연동 후 제공 예정입니다." />
      </View>
    );
  }

  const isEmpty = filteredItems.length === 0;

  return (
    <FlatList
      style={{ flex: 1 }}
      data={filteredItems}
      keyExtractor={(r) => r.id}
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
        <EmptyState
          message={
            searchQuery.trim()
              ? "검색 결과가 없습니다."
              : "채팅방이 없습니다."
          }
        />
      }
      renderItem={({ item }) => {
        const peer = item.peer;
        const titleFromPost = item.post?.title;
        const displayName =
          item.kind === "ANNOUNCEMENT" && titleFromPost
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
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: "#F0F0F0" }} />
      )}
      contentContainerStyle={contentContainerWhenEmpty(isEmpty, {
        paddingBottom: 20,
      })}
    />
  );
}

function MyAnnouncementsList({ searchQuery = "" }: { searchQuery?: string }) {
  const navigation = useNavigation<any>();
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState<AnnouncementListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFirst = useCallback(async () => {
    if (!isLoggedIn) {
      setPosts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await getMyAnnouncementList({ limit: 20 });
    if (res) {
      setPosts(res.items);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } else {
      setPosts([]);
      setCursor(null);
      setHasMore(false);
    }
    setLoading(false);
  }, [isLoggedIn]);

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
    if (!isLoggedIn || !hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const res = await getMyAnnouncementList({ cursor, limit: 20 });
    if (res) {
      setPosts((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  };

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return posts;
    return posts.filter((item) => matchesAnnouncement(item, q));
  }, [posts, searchQuery]);

  if (!isLoggedIn) {
    return (
      <View style={emptyScreenStyle}>
        <EmptyState message="로그인 후 내 공고 목록을 불러올 수 있습니다." />
      </View>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1F2A44" />
      </View>
    );
  }

  const isEmpty = filteredPosts.length === 0;

  return (
    <FlatList
      style={{ flex: 1 }}
      data={filteredPosts}
      keyExtractor={(p) => p.postId}
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
        <EmptyState
          message={
            searchQuery.trim()
              ? "검색 결과가 없습니다."
              : "작성한 공고가 없습니다."
          }
        />
      }
      renderItem={({ item }) => (
        <MyAnnouncementListItem
          item={item}
          onPress={() =>
            navigation.navigate(RootRoutes.MY_POSTED_CHAT_ROOMS, {
              announcement: item,
            })
          }
        />
      )}
      contentContainerStyle={contentContainerWhenEmpty(isEmpty, {
        paddingBottom: 20,
      })}
    />
  );
}

const ChatList = ({ topTab, filter = "전체", searchQuery = "" }: ChatListProps) => {
  if (topTab === "내 공고") {
    return <MyAnnouncementsList searchQuery={searchQuery} />;
  }

  if (topTab === "일반") {
    return (
      <ChatRoomsFlatList mode="coffee" filter={filter} searchQuery={searchQuery} />
    );
  }

  return (
    <ChatRoomsFlatList mode="applied" filter={filter} searchQuery={searchQuery} />
  );
};

export default ChatList;
