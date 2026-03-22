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
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getCoffeeRooms, getAppliedRooms } from "../../../../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../../../../lib/apis/chat/types";
import { getMyAnnouncementList } from "../../../../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../../../../lib/apis/announcement/types";
import { formatChatListTime } from "../../../../../lib/chat/formatChatTime";
import { chatRoomItemToParams } from "../../../../../lib/chat/chatRoomNavigation";
import { CHAT_APPLIED_ROOMS_REFRESH } from "../../../../../lib/chat/chatRoomsEvents";

type ChatTopTab = "일반" | "내 공고" | "지원 공고";

/** 탭별 안읽음 배지 — 서버에 unread 필드 없음 */
export function getUnreadCountByTopTabMock(_topTab: ChatTopTab): number {
  return 0;
}

interface ChatListProps {
  topTab: ChatTopTab;
  filter?: ChatFilter;
}

function ChatRoomsFlatList({
  mode,
  filter,
}: {
  mode: "coffee" | "applied";
  filter: ChatFilter;
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
    return items;
  }, [items, filter]);

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
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#888", textAlign: "center" }}>
          로그인 후 채팅 목록을 불러올 수 있습니다.
        </Text>
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
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#888", textAlign: "center" }}>
          안읽음 필터는 서버 연동 후 제공 예정입니다.
        </Text>
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
        <View style={{ paddingHorizontal: 24, alignItems: "center" }}>
          <Text style={{ color: "#888", textAlign: "center" }}>
            채팅방이 없습니다.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const peer = item.peer;
        const titleFromPost = item.post?.title;
        const displayName =
          item.kind === "ANNOUNCEMENT" && titleFromPost
            ? titleFromPost
            : peer?.nickname ?? peer?.activityName ?? "채팅";
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
      contentContainerStyle={[
        { paddingBottom: 20 },
        isEmpty && { flexGrow: 1, justifyContent: "center" },
      ]}
    />
  );
}

function MyAnnouncementsList() {
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

  if (!isLoggedIn) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#888", textAlign: "center" }}>
          로그인 후 내 공고 목록을 불러올 수 있습니다.
        </Text>
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

  const isEmpty = posts.length === 0;

  return (
    <FlatList
      style={{ flex: 1 }}
      data={posts}
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
        <View style={{ paddingHorizontal: 24, alignItems: "center" }}>
          <Text style={{ color: "#888", textAlign: "center" }}>
            작성한 공고가 없습니다.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            navigation.navigate(RootRoutes.MY_POSTED_CHAT_ROOMS, {
              postId: item.postId,
              title: item.title,
              typeTag: item.type,
              statusTag: item.isRecruiting ? "모집중" : "마감",
              dDay: item.dDay,
            })
          }
          style={{
            paddingHorizontal: 16,
            paddingVertical: 14,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#EFEFEF",
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: "#D1D5DB",
              }}
            />
            <View style={{ flex: 1, minWidth: 0 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#111827",
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcons name="person" size={18} color="#000000" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: "#000000",
                      }}
                    >
                      –
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    height: 24,
                    paddingHorizontal: 8,
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                  }}
                >
                  <Text
                    style={{
                      color: "#111827",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {item.isRecruiting ? "모집중" : "마감"}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#1F2A44",
                    borderRadius: 12,
                    height: 24,
                    paddingHorizontal: 8,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {item.dDay}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      )}
      contentContainerStyle={[
        { paddingBottom: 20 },
        isEmpty && { flexGrow: 1, justifyContent: "center" },
      ]}
    />
  );
}

const ChatList = ({ topTab, filter = "전체" }: ChatListProps) => {
  if (topTab === "내 공고") {
    return <MyAnnouncementsList />;
  }

  if (topTab === "일반") {
    return <ChatRoomsFlatList mode="coffee" filter={filter} />;
  }

  return <ChatRoomsFlatList mode="applied" filter={filter} />;
};

export default ChatList;
