import { useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatItem from "../ChatItem/ChatItem";
import { RootRoutes } from "../../../../../navigations/routes";
import type { ChatFilter } from "../../types";
import { Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const MOCK_CHATS = [
  {
    id: "1",
    name: "교향악단 바이올린 객원단용 채용",
    handle: "sejongculture",
    lastMessage: "리허설 일정 조율 부탁드립니다",
    timestamp: "오전 7시 40분",
    unreadCount: 2,
    isOnline: false,
    isMyPosted: true,
    isApplication: false,
    isMusic: false,
    isVerified: false,
    memberCount: 3,
  },
  {
    id: "2",
    name: "하반기 발레 공고",
    handle: "soundstage",
    lastMessage: "음향 장비 세팅 완료했습니다",
    timestamp: "오전 6시 10분",
    unreadCount: 1,
    isOnline: true,
    isMyPosted: false,
    isApplication: true,
    isMusic: true,
    isVerified: false,
    memberCount: 5,
  },
  {
    id: "3",
    name: "블루노트 서울",
    handle: "bluenote",
    lastMessage: "공연 피드백 감사합니다!",
    timestamp: "09.25",
    unreadCount: 0,
    isOnline: false,
    isMyPosted: true,
    isApplication: true,
    isMusic: true,
    isVerified: true,
    memberCount: 2,
  },
];

type ChatTopTab = "일반" | "내 공고" | "지원 공고";

function matchesTopTab(
  chat: (typeof MOCK_CHATS)[0],
  topTab: ChatTopTab,
): boolean {
  return topTab === "일반"
    ? !chat.isMyPosted && !chat.isApplication
    : topTab === "내 공고"
      ? chat.isMyPosted
      : chat.isApplication;
}

export function getUnreadCountByTopTabMock(topTab: ChatTopTab): number {
  return MOCK_CHATS.reduce((sum, c) => {
    if (!matchesTopTab(c, topTab)) return sum;
    return sum + (c.unreadCount > 0 ? c.unreadCount : 0);
  }, 0);
}

const MOCK_MY_POSTS = [
  {
    postId: "post-1",
    title: "교향악단 바이올린 객원단원 채용",
    typeTag: "오디션(연주자 모집)",
    statusTag: "모집중",
    dDay: "D-20",
    roomsCount: 3,
    unreadTotal: 3,
  },
  {
    postId: "post-2",
    title: "하반기 발레 공고",
    typeTag: "오디션(무용수 모집)",
    statusTag: "모집중",
    dDay: "D-7",
    roomsCount: 5,
    unreadTotal: 1,
  },
] as const;

interface ChatListProps {
  topTab: ChatTopTab;
  filter?: ChatFilter;
}

const ChatList = ({ topTab, filter = "전체" }: ChatListProps) => {
  const navigation = useNavigation<any>();

  if (topTab === "내 공고") {
    return (
      <FlatList
        data={MOCK_MY_POSTS}
        keyExtractor={(p) => p.postId}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate(RootRoutes.MY_POSTED_CHAT_ROOMS, {
                postId: item.postId,
                title: item.title,
                typeTag: item.typeTag,
                statusTag: item.statusTag,
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
                      <MaterialIcons name="person" size={18} color="#9CA3AF" />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          color: "#9CA3AF",
                        }}
                      >
                        {item.roomsCount}
                      </Text>
                    </View>
                  </View>
                  {item.unreadTotal > 0 && (
                    <View
                      style={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: "#E11D48",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 5,
                        flexShrink: 0,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        {item.unreadTotal > 99
                          ? "99+"
                          : String(item.unreadTotal)}
                      </Text>
                    </View>
                  )}
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
                      borderRadius: 14,
                      height: 28,
                      paddingHorizontal: 10,
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                    }}
                  >
                    <Text
                      style={{
                        color: "#111827",
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      {item.statusTag}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#1F2A44",
                      borderRadius: 14,
                      height: 28,
                      paddingHorizontal: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 13,
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
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  }

  const filteredChats = useMemo(() => {
    return MOCK_CHATS.filter((chat) => {
      if (!matchesTopTab(chat, topTab)) return false;

      if (filter === "안읽음") return chat.unreadCount > 0;
      return true; // "전체"
    });
  }, [filter, topTab]);

  const handleChatPress = (item: (typeof MOCK_CHATS)[0]) => {
    navigation.navigate(RootRoutes.CHAT_ROOM, {
      name: item.name,
      handle: item.handle,
      isOnline: item.isOnline,
    });
  };

  return (
    <FlatList
      data={filteredChats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => handleChatPress(item)}>
          <ChatItem
            name={item.name}
            lastMessage={item.lastMessage}
            timestamp={item.timestamp}
            unreadCount={item.unreadCount}
            isOnline={item.isOnline}
            isMusic={item.isMusic}
            isVerified={item.isVerified}
            variant="default"
          />
        </Pressable>
      )}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 1,
            backgroundColor: "#F0F0F0",
          }}
        />
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default ChatList;
