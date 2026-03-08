import { useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../components/Logo/Logo";
import { MAIN } from "../../color";
import SelectableTag from "../../components/SelectableTag/SelectableTag";
import styles from "./styles";
import ChatList from "./components/ChatList/ChatList";
import type { ChatFilter } from "./types";

const CHAT_FILTER_OPTIONS: ChatFilter[] = ["전체", "안읽음", "내가올린공고", "지원공고"];

const ChatScreen = () => {
  const { top } = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<ChatFilter>("전체");
  const filterScrollRef = useRef<ScrollView>(null);

  const handleFilterPress = (filter: ChatFilter) => {
    setSelectedFilter(filter);
    if (filter === "전체") {
      filterScrollRef.current?.scrollTo({ x: 0, animated: true });
    } else if (filter === "지원공고") {
      filterScrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Logo size={24} logoName="채팅" />
        <View style={styles.iconContainer}>
          <Pressable style={styles.iconButton}>
            <Feather name="search" size={23} color={MAIN.DEFAULT} />
          </Pressable>
        </View>
      </View>
      <View style={styles.filterWrapper}>
        <ScrollView
          ref={filterScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
        {CHAT_FILTER_OPTIONS.map((filter) => (
          <SelectableTag
            key={filter}
            label={filter}
            selected={selectedFilter === filter}
            onPress={() => handleFilterPress(filter)}
          />
        ))}
        </ScrollView>
      </View>
      <ChatList filter={selectedFilter} />
    </View>
  );
};

export default ChatScreen;
