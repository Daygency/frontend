import { useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatItem from "../ChatItem/ChatItem";
import { GRAY } from "../../../../color";
import { RootRoutes } from "../../../../navigations/routes";
import type { ChatFilter } from "../../types";

const MOCK_CHATS = [
  {
    id: "1",
    name: "세종문화회관",
    handle: "sejongculture",
    tag: "공연장",
    lastMessage: "리허설 일정 조율 부탁드립니다",
    timestamp: "어제",
    unreadCount: 0,
    isOnline: false,
    isMyPosted: true,
    isApplication: false,
  },
  {
    id: "2",
    name: "사운드스테이지",
    handle: "soundstage",
    tag: "업체",
    lastMessage: "음향 장비 세팅 완료했습니다",
    timestamp: "09.28",
    unreadCount: 1,
    isOnline: true,
    isMyPosted: false,
    isApplication: true,
  },
  {
    id: "3",
    name: "블루노트 서울",
    handle: "bluenote",
    tag: "기획사",
    lastMessage: "공연 피드백 감사합니다!",
    timestamp: "09.25",
    unreadCount: 0,
    isOnline: false,
    isMyPosted: true,
    isApplication: true,
  },
];

interface ChatListProps {
  filter: ChatFilter;
}

const ChatList = ({ filter }: ChatListProps) => {
  const navigation = useNavigation<any>();

  const filteredChats = useMemo(() => {
    return MOCK_CHATS.filter((chat) => {
      if (filter === "전체") return true;
      if (filter === "안읽음") return chat.unreadCount > 0;
      if (filter === "내가올린공고") return chat.isMyPosted;
      if (filter === "지원공고") return chat.isApplication;
      return true;
    });
  }, [filter]);

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
            tag={item.tag}
            lastMessage={item.lastMessage}
            timestamp={item.timestamp}
            unreadCount={item.unreadCount}
            isOnline={item.isOnline}
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
