import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../../components/Logo/Logo";
import { MAIN } from "../../../color";
import styles from "./styles";
import ChatList, { getUnreadCountByTopTabMock } from "./components/ChatList/ChatList";

type ChatTopTab = "일반" | "내 공고" | "지원 공고";
const TOP_TABS: ChatTopTab[] = ["일반", "내 공고", "지원 공고"];

const ChatScreen = () => {
  const { top } = useSafeAreaInsets();
  const [selectedTopTab, setSelectedTopTab] = useState<ChatTopTab>("일반");

  const unreadCountByTab = useMemo(() => {
    const map = new Map<ChatTopTab, number>();
    TOP_TABS.forEach((t) => map.set(t, getUnreadCountByTopTabMock(t)));
    return map;
  }, []);

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

      <View style={styles.topTabsRow}>
        {TOP_TABS.map((tab) => {
          const selected = selectedTopTab === tab;
          const unreadCount = unreadCountByTab.get(tab) ?? 0;
          return (
            <Pressable
              key={tab}
              style={[styles.topTab, selected && styles.topTabSelected]}
              onPress={() => setSelectedTopTab(tab)}
            >
              <Text style={[styles.topTabText, selected && styles.topTabTextSelected]}>
                {tab}
              </Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>
                    {unreadCount > 99 ? "99+" : String(unreadCount)}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <ChatList topTab={selectedTopTab} />
    </View>
  );
};

export default ChatScreen;
