import { FlatList } from "react-native";
import ChatItem, { ChatItemData } from "../ChatItem/ChatItem";
import EmptyChat from "../EmptyChat/EmptyChat";
import styles from "./styles";

interface ChatListProps {
  chats: ChatItemData[];
  onChatPress?: (chat: ChatItemData) => void;
}

const ChatList = ({ chats, onChatPress }: ChatListProps) => {
  if (chats.length === 0) {
    return <EmptyChat />;
  }

  return (
    <FlatList
      data={chats}
      renderItem={({ item }) => (
        <ChatItem data={item} onPress={() => onChatPress?.(item)} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ChatList;

