import { useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter, Pressable, Text, TextInput, View } from "react-native";
import SquircleView from "react-native-fast-squircle";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../../components/ui/Logo";
import { GRAY, MAIN } from "../../../color";
import { useAuthGate } from "../../../hooks/useRequireLogin";
import { useAuth } from "../../../contexts/AuthContext";
import { RootRoutes } from "../../../navigations/routes";
import { getChatUnreadCountByTab } from "../../../lib/apis/chat/chatApi";
import {
  CHAT_ROOMS_REFRESH,
  CHAT_ROOM_UPDATED,
} from "../../../lib/chat/chatRoomsEvents";
import styles from "./styles";
import ChatList from "./components/ChatList/ChatList";

type ChatTopTab = "전체" | "1:1" | "내 공고" | "지원 공고";
const TOP_TABS: ChatTopTab[] = ["전체", "1:1", "내 공고", "지원 공고"];

const ChatScreen = () => {
  useAuthGate();
  const navigation = useNavigation<any>();
  const { top } = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();
  const [selectedTopTab, setSelectedTopTab] = useState<ChatTopTab>("전체");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadByTab, setUnreadByTab] = useState<Map<ChatTopTab, number>>(
    new Map(),
  );

  const refreshUnreadByTab = useCallback(async () => {
    if (!isLoggedIn) {
      setUnreadByTab(new Map());
      return;
    }
    const counts = await getChatUnreadCountByTab();
    if (!counts) return;
    setUnreadByTab(
      new Map<ChatTopTab, number>([
        ["1:1", counts.dm],
        ["지원 공고", counts.appliedAnnouncement],
        ["내 공고", counts.myAnnouncement],
      ]),
    );
  }, [isLoggedIn]);

  useFocusEffect(
    useCallback(() => {
      void refreshUnreadByTab();
    }, [refreshUnreadByTab]),
  );

  useEffect(() => {
    const subs = [
      DeviceEventEmitter.addListener(CHAT_ROOMS_REFRESH, () => {
        void refreshUnreadByTab();
      }),
      DeviceEventEmitter.addListener(CHAT_ROOM_UPDATED, () => {
        void refreshUnreadByTab();
      }),
    ];
    return () => subs.forEach((s) => s.remove());
  }, [refreshUnreadByTab]);

  const searchPlaceholder =
    selectedTopTab === "내 공고" ? "공고 제목 검색" : "이름, 메시지 검색";

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        {isSearchOpen ? (
          <View style={styles.headerSearchWrap}>
            <Feather name="search" size={18} color={GRAY.DARK_2} />
            <TextInput
              style={styles.headerSearchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={GRAY.DARK_2}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 ? (
              <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                <Feather name="x-circle" size={18} color={GRAY.DARK_2} />
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.headerTitleWrap}>
            <Logo logoName="채팅" />
          </View>
        )}
        <View style={styles.iconContainer}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.navigate(RootRoutes.CHAT_FILE_ARCHIVE)}
          >
            <Feather name="archive" size={23} color={MAIN.DEFAULT} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => {
              if (isSearchOpen) {
                closeSearch();
              } else {
                setIsSearchOpen(true);
              }
            }}
          >
            <Feather
              name={isSearchOpen ? "x" : "search"}
              size={23}
              color={MAIN.DEFAULT}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.topTabsRow}>
        {TOP_TABS.map((tab) => {
          const selected = selectedTopTab === tab;
          const unreadCount = tab === "전체" ? 0 : (unreadByTab.get(tab) ?? 0);
          return (
            <Pressable key={tab} onPress={() => setSelectedTopTab(tab)}>
              {({ pressed }) => (
                <SquircleView
                  cornerSmoothing={0.6}
                  style={[
                    styles.topTab,
                    selected && styles.topTabSelected,
                    pressed && styles.topTabPressed,
                  ]}
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
                </SquircleView>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }}>
        <ChatList topTab={selectedTopTab} searchQuery={searchQuery} />
      </View>
    </View>
  );
};

export default ChatScreen;
