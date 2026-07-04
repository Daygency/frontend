import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../../components/ui/Logo";
import { GRAY, MAIN } from "../../../color";
import { useAuthGate } from "../../../hooks/useRequireLogin";
import { RootRoutes } from "../../../navigations/routes";
import styles from "./styles";
import ChatList, { getUnreadCountByTopTabMock } from "./components/ChatList/ChatList";

type ChatTopTab = "일반" | "내 공고" | "지원 공고";
const TOP_TABS: ChatTopTab[] = ["일반", "내 공고", "지원 공고"];

const ChatScreen = () => {
  useAuthGate();
  const navigation = useNavigation<any>();
  const { top } = useSafeAreaInsets();
  const [selectedTopTab, setSelectedTopTab] = useState<ChatTopTab>("일반");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCountByTab = useMemo(() => {
    const map = new Map<ChatTopTab, number>();
    TOP_TABS.forEach((t) => map.set(t, getUnreadCountByTopTabMock(t)));
    return map;
  }, []);

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

      <View style={{ flex: 1 }}>
        <ChatList topTab={selectedTopTab} searchQuery={searchQuery} />
      </View>
    </View>
  );
};

export default ChatScreen;
