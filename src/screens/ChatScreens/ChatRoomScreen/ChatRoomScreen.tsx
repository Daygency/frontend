import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { RootRoutes } from "../../../navigations/routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { GRAY, MAIN } from "../../../color";
import styles from "./styles";
import { getChatMessages } from "../../../lib/apis/chat/chatApi";
import { findMessageMatchIndices } from "../../../lib/chat/chatSearch";
import { createChatSocket } from "../../../lib/chat/createChatSocket";
import { usePeerAvatarUrl } from "../../../lib/chat/usePeerAvatarUrl";
import HighlightText from "../../../components/HighlightText/HighlightText";
import type { Socket } from "socket.io-client";

export type ChatRoomParams = {
  /** 백엔드 채팅방 UUID */
  chatRoomId: string;
  /** 상대 user UUID (내 메시지 판별용). 없으면 첫 메시지 로드 시 추론 */
  peerUserId?: string;
  name: string;
  handle: string;
  isOnline?: boolean;
  /** 상대 프로필 이미지 (목록/프로필에서 전달) */
  peerAvatarUrl?: string;
};

type MessageItem = {
  id: string;
  text: string;
  isFromMe: boolean;
  timestamp: string;
};

type WsMessagePayload = {
  id?: string;
  chatRoomId?: string;
  userId?: string;
  content?: string | null;
  createdAt?: string;
};

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const h = hours % 12 || 12;
  return `${ampm} ${h}:${minutes.toString().padStart(2, "0")}`;
};

const ChatRoomScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ ChatRoom: ChatRoomParams }, "ChatRoom">>();
  const { user } = useAuth();
  const { top, bottom } = useSafeAreaInsets();
  const {
    chatRoomId = "",
    peerUserId: peerUserIdParam = "",
    name,
    handle = "",
    isOnline = false,
    peerAvatarUrl: peerAvatarUrlParam,
  } = route.params ?? {};

  const myUserId = String(user?.socialId ?? "");
  const [peerUserId, setPeerUserId] = useState(peerUserIdParam || "");

  /** 지원 직후 등 목록에 peer 가 비어 있을 때, 메시지에서 상대 ID 추론 */
  useEffect(() => {
    if (!chatRoomId || peerUserId) return;
    let cancelled = false;
    (async () => {
      const page = await getChatMessages(chatRoomId, { page: 1, limit: 50 });
      if (cancelled || !page?.items?.length) return;
      for (const m of page.items) {
        const uid = String(m.userId ?? "").trim();
        if (uid && uid !== myUserId) {
          setPeerUserId(uid);
          return;
        }
      }
      const u0 = String(page.items[0]?.userId ?? "").trim();
      if (u0) setPeerUserId(u0);
    })();
    return () => {
      cancelled = true;
    };
  }, [chatRoomId, peerUserId, myUserId]);

  const peerAvatarDisplay = usePeerAvatarUrl(
    peerUserId || undefined,
    peerAvatarUrlParam,
  );
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendReady, setSendReady] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const messageRowRefs = useRef<Record<string, View | null>>({});
  const socketRef = useRef<Socket | null>(null);

  const matchIndices = useMemo(
    () => findMessageMatchIndices(messages, searchQuery),
    [messages, searchQuery],
  );

  const activeMatchMessageId =
    matchIndices.length > 0
      ? messages[matchIndices[activeMatchIndex]]?.id
      : null;

  const scrollToMessage = useCallback((messageId: string) => {
    const node = messageRowRefs.current[messageId];
    const scrollNode = scrollViewRef.current;
    if (!node || !scrollNode) return;
    node.measureLayout(
      scrollNode as unknown as number,
      (_x, y) => {
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, y - 16),
          animated: true,
        });
      },
      () => {},
    );
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;
    setActiveMatchIndex(0);
  }, [searchQuery, isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen || !activeMatchMessageId) return;
    requestAnimationFrame(() => scrollToMessage(activeMatchMessageId));
  }, [activeMatchIndex, activeMatchMessageId, isSearchOpen, scrollToMessage]);

  const goToPrevMatch = () => {
    if (!matchIndices.length) return;
    setActiveMatchIndex(
      (prev) => (prev - 1 + matchIndices.length) % matchIndices.length,
    );
  };

  const goToNextMatch = () => {
    if (!matchIndices.length) return;
    setActiveMatchIndex((prev) => (prev + 1) % matchIndices.length);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setActiveMatchIndex(0);
  };

  const appendFromSocket = useCallback(
    (payload: WsMessagePayload) => {
      const id = String(payload.id ?? "");
      const uid = String(payload.userId ?? "");
      const createdAt = payload.createdAt;
      if (!id || !createdAt) return;
      const text = payload.content ?? "";
      /** README `MessagePayload.userId` — 본인 여부는 발신 userId로 판별 */
      const isFromMe = myUserId
        ? uid === myUserId
        : uid !== String(peerUserId);
      const timestamp = formatTime(new Date(createdAt));
      setMessages((prev) => {
        if (prev.some((m) => m.id === id)) return prev;
        return [...prev, { id, text, isFromMe, timestamp }];
      });
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    },
    [peerUserId, myUserId],
  );

  useEffect(() => {
    if (!chatRoomId || !peerUserId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      const page = await getChatMessages(chatRoomId, { page: 1, limit: 100 });
      if (cancelled) return;
      const items = page?.items ?? [];
      const chronological = [...items].reverse();
      setMessages(
        chronological.map((m) => ({
          id: m.id,
          text: m.content ?? "",
          isFromMe: myUserId
            ? String(m.userId) === myUserId
            : String(m.userId) !== String(peerUserId),
          timestamp: formatTime(new Date(m.createdAt)),
        })),
      );
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 80);
    })();

    return () => {
      cancelled = true;
    };
  }, [chatRoomId, peerUserId, myUserId]);

  useEffect(() => {
    if (!chatRoomId || !peerUserId) return;

    let cancelled = false;

    (async () => {
      const socket = await createChatSocket();
      if (cancelled) {
        socket?.disconnect();
        return;
      }
      socketRef.current = socket;
      if (!socket) {
        setSendReady(false);
        return;
      }

      const join = () => {
        socket.emit("joinRoom", { chatRoomId });
      };

      const onConnect = () => {
        join();
        setSendReady(true);
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", () => setSendReady(false));
      if (socket.connected) onConnect();

      socket.on("message", (payload: WsMessagePayload) => {
        if (String(payload.chatRoomId) !== String(chatRoomId)) return;
        appendFromSocket(payload);
      });

      socket.on("connect_error", (err) => {
        console.warn("[chat socket] connect_error", err?.message);
        setSendReady(false);
      });
    })();

    return () => {
      cancelled = true;
      const s = socketRef.current;
      if (s) {
        s.emit("leaveRoom", { chatRoomId });
        s.removeAllListeners();
        s.disconnect();
      }
      socketRef.current = null;
      setSendReady(false);
    };
  }, [chatRoomId, peerUserId, appendFromSocket]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed || !chatRoomId) return;
    const socket = socketRef.current;
    if (!socket?.connected) {
      Alert.alert("연결 대기", "채팅 서버에 연결된 뒤 다시 시도해 주세요.");
      return;
    }
    /** README `sendMessage` — ack `{ ok, messageId }` */
    socket.emit(
      "sendMessage",
      { chatRoomId, content: trimmed },
      (ack: { ok?: boolean } | undefined) => {
        if (ack && ack.ok === false) {
          Alert.alert(
            "전송 실패",
            "메시지를 보내지 못했습니다. 다시 시도해 주세요.",
          );
        }
      },
    );
    setMessage("");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;
    const shiftKey = "shiftKey" in e.nativeEvent && e.nativeEvent.shiftKey;
    if (key === "Enter" && !shiftKey) {
      sendMessage();
    }
  };

  const toggleAttachmentMenu = () => {
    if (!isAttachmentMenuOpen) {
      Keyboard.dismiss();
    }
    setIsAttachmentMenuOpen((prev) => !prev);
  };

  const displayHandle = handle.startsWith("@") ? handle : `@${handle}`;

  const baseBottomPadding = bottom || 16;
  const inputBarPaddingBottom = isKeyboardVisible
    ? Math.max(6, baseBottomPadding - 23)
    : baseBottomPadding;

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setIsKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    setAvatarLoadError(false);
  }, [peerAvatarDisplay]);

  if (!chatRoomId || !peerUserId) {
    return (
      <View style={[styles.container, { paddingTop: top, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }]}>
        <Text style={{ color: GRAY.DARK_2, textAlign: "center" }}>
          채팅방 정보가 없습니다. 목록에서 다시 들어와 주세요.
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: "#2563EB", fontWeight: "600" }}>돌아가기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#000" />
        </Pressable>

        <View style={styles.userInfo}>
          {isSearchOpen ? (
            <View style={styles.headerSearchWrap}>
              <Feather name="search" size={18} color={GRAY.DARK_2} />
              <TextInput
                style={styles.headerSearchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="대화 내용 검색"
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
            <>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  {peerAvatarDisplay && !avatarLoadError ? (
                    <Image
                      source={{ uri: peerAvatarDisplay }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                      onError={() => setAvatarLoadError(true)}
                    />
                  ) : (
                    <Text style={styles.avatarText}>{name?.charAt(0) ?? "?"}</Text>
                  )}
                </View>
                {isOnline && <View style={styles.onlineIndicator} />}
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.name} numberOfLines={1}>
                  {name ?? "채팅방"}
                </Text>
                <Text style={styles.handle} numberOfLines={1}>
                  {displayHandle}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.headerRightButtons}>
          <Pressable
            hitSlop={10}
            style={styles.headerButton}
            onPress={() => {
              if (isSearchOpen) {
                closeSearch();
              } else {
                setIsSearchOpen(true);
              }
            }}
          >
            <Feather name={isSearchOpen ? "x" : "search"} size={22} color="#000" />
          </Pressable>
          <Pressable
            hitSlop={10}
            style={styles.headerButton}
            onPress={() => navigation.navigate(RootRoutes.CHAT_ROOM_OPTIONS)}
          >
            <MaterialCommunityIcons name="menu" size={22} color="#000" />
          </Pressable>
        </View>
      </View>

      {isSearchOpen && searchQuery.trim() ? (
        <View style={styles.searchMatchNav}>
          <Text style={styles.searchMatchCount}>
            {matchIndices.length > 0
              ? `${activeMatchIndex + 1} / ${matchIndices.length}`
              : "결과 없음"}
          </Text>
          <View style={styles.searchMatchButtons}>
            <Pressable
              onPress={goToPrevMatch}
              disabled={matchIndices.length === 0}
              style={styles.searchMatchButton}
            >
              <Feather name="chevron-up" size={20} color={MAIN.DEFAULT} />
            </Pressable>
            <Pressable
              onPress={goToNextMatch}
              disabled={matchIndices.length === 0}
              style={styles.searchMatchButton}
            >
              <Feather name="chevron-down" size={20} color={MAIN.DEFAULT} />
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Message area */}
      <View style={styles.messageArea}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={MAIN.DEFAULT} />
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messageAreaScroll}
            contentContainerStyle={styles.messageAreaContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              if (!isSearchOpen) {
                scrollViewRef.current?.scrollToEnd({ animated: false });
              }
            }}
          >
            {messages.map((msg) => {
              const isActiveMatch = activeMatchMessageId === msg.id;
              const rowRef = (node: View | null) => {
                messageRowRefs.current[msg.id] = node;
              };
              const textContent = isSearchOpen && searchQuery.trim() ? (
                <HighlightText
                  text={msg.text}
                  query={searchQuery}
                  style={
                    msg.isFromMe
                      ? [styles.messageText, styles.messageTextMe]
                      : styles.messageText
                  }
                  highlightStyle={styles.messageHighlight}
                />
              ) : (
                <Text
                  style={
                    msg.isFromMe
                      ? [styles.messageText, styles.messageTextMe]
                      : styles.messageText
                  }
                >
                  {msg.text}
                </Text>
              );

              return msg.isFromMe ? (
                <View
                  key={msg.id}
                  ref={rowRef}
                  style={[
                    styles.messageRow,
                    styles.messageRowFromMe,
                    isActiveMatch && styles.messageRowActiveMatch,
                  ]}
                >
                  <Text style={[styles.messageTime, styles.messageTimeBeforeBubble]}>
                    {msg.timestamp}
                  </Text>
                  <View style={styles.messageBubbleMe}>{textContent}</View>
                </View>
              ) : (
                <View
                  key={msg.id}
                  ref={rowRef}
                  style={[
                    styles.messageRow,
                    styles.messageRowFromOther,
                    isActiveMatch && styles.messageRowActiveMatch,
                  ]}
                >
                  <View style={styles.otherAvatar}>
                    {peerAvatarDisplay && !avatarLoadError ? (
                      <Image
                        source={{ uri: peerAvatarDisplay }}
                        style={styles.otherAvatarImage}
                        resizeMode="cover"
                        onError={() => setAvatarLoadError(true)}
                      />
                    ) : (
                      <Text style={styles.otherAvatarText}>
                        {name?.charAt(0) ?? "?"}
                      </Text>
                    )}
                  </View>
                  <View style={styles.messageBubbleOther}>{textContent}</View>
                  <Text style={[styles.messageTime, styles.messageTimeAfterBubble]}>
                    {msg.timestamp}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
        {isAttachmentMenuOpen && (
          <Pressable
            style={styles.dismissOverlay}
            onPress={() => setIsAttachmentMenuOpen(false)}
          />
        )}
      </View>

      {/* Attachment menu */}
      {isAttachmentMenuOpen && (
        <View style={[styles.attachmentMenu, { paddingBottom: bottom || 16 }]}>
          <Pressable style={styles.attachmentOption}>
            <View style={[styles.attachmentIconCircle, { backgroundColor: "rgba(76, 175, 80, 0.15)" }]}>
              <MaterialCommunityIcons
                name="image-multiple-outline"
                size={28}
                color="#4CAF50"
              />
            </View>
            <Text style={styles.attachmentLabel}>앨범</Text>
          </Pressable>
          <Pressable style={styles.attachmentOption}>
            <View style={[styles.attachmentIconCircle, { backgroundColor: "rgba(255, 193, 7, 0.2)" }]}>
              <MaterialCommunityIcons
                name="bank-transfer-out"
                size={28}
                color="#F9A825"
              />
            </View>
            <Text style={styles.attachmentLabel}>송금</Text>
          </Pressable>
        </View>
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: inputBarPaddingBottom }]}>
        <Pressable style={styles.addButton} onPress={toggleAttachmentMenu}>
          {isAttachmentMenuOpen ? (
            <MaterialCommunityIcons name="close" size={22} color="#666" />
          ) : (
            <Feather name="plus" size={22} color="#666" />
          )}
        </Pressable>
        <TextInput
          style={[
            styles.input,
            !isKeyboardVisible && styles.inputSingleLine,
          ]}
          value={message}
          onChangeText={setMessage}
          onKeyPress={handleKeyPress}
          onSubmitEditing={sendMessage}
          placeholder={sendReady ? "메시지를 입력하세요" : "연결 중…"}
          placeholderTextColor={GRAY.DARK_2}
          multiline
          maxLength={255}
          scrollEnabled={isKeyboardVisible}
          blurOnSubmit={false}
          returnKeyType="send"
        />
        <Pressable
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!message.trim() || !sendReady}
          onPress={sendMessage}
        >
          <MaterialCommunityIcons
            name="send"
            size={22}
            color={message.trim() && sendReady ? "#000" : GRAY.DARK_2}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
