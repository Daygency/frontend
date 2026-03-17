import { useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatItem from "../ChatItem/ChatItem";
import { RootRoutes } from "../../../../../navigations/routes";
import type { ChatFilter } from "../../types";

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

function matchesTopTab(chat: (typeof MOCK_CHATS)[0], topTab: ChatTopTab): boolean {
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

interface ChatListProps {
  topTab: ChatTopTab;
  filter?: ChatFilter;
}

const ChatList = ({ topTab, filter = "전체" }: ChatListProps) => {
  const navigation = useNavigation<any>();

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
            variant={topTab === "내 공고" ? "group" : "default"}
            memberCount={(item as any).memberCount}
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
