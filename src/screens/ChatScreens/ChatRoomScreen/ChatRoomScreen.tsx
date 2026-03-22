import { useState, useEffect, useRef, useCallback } from "react";
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
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootRoutes } from "../../../navigations/routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { GRAY, MAIN } from "../../../color";
import styles from "./styles";
import { getChatMessages } from "../../../lib/apis/chat/chatApi";
import { createChatSocket } from "../../../lib/chat/createChatSocket";
import type { Socket } from "socket.io-client";

export type ChatRoomParams = {
  /** 백엔드 채팅방 UUID */
  chatRoomId: string;
  /** 상대 user UUID (내 메시지 판별용) */
  peerUserId: string;
  name: string;
  handle: string;
  isOnline?: boolean;
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
  const { top, bottom } = useSafeAreaInsets();
  const {
    chatRoomId = "",
    peerUserId = "",
    name,
    handle = "",
    isOnline = false,
  } = route.params ?? {};

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendReady, setSendReady] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<Socket | null>(null);

  const appendFromSocket = useCallback(
    (payload: WsMessagePayload) => {
      const id = String(payload.id ?? "");
      const uid = String(payload.userId ?? "");
      const createdAt = payload.createdAt;
      if (!id || !createdAt) return;
      const text = payload.content ?? "";
      const isFromMe = uid !== String(peerUserId);
      const timestamp = formatTime(new Date(createdAt));
      setMessages((prev) => {
        if (prev.some((m) => m.id === id)) return prev;
        return [...prev, { id, text, isFromMe, timestamp }];
      });
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    },
    [peerUserId],
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
          isFromMe: String(m.userId) !== String(peerUserId),
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
  }, [chatRoomId, peerUserId]);

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
    socket.emit("sendMessage", { chatRoomId, content: trimmed });
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
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name?.charAt(0) ?? "?"}</Text>
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
        </View>

        <View style={styles.headerRightButtons}>
          <Pressable hitSlop={10} style={styles.headerButton}>
            <Feather name="search" size={22} color="#000" />
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
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: false })
            }
          >
            {messages.map((msg) =>
              msg.isFromMe ? (
                <View
                  key={msg.id}
                  style={[styles.messageRow, styles.messageRowFromMe]}
                >
                  <Text style={[styles.messageTime, styles.messageTimeBeforeBubble]}>
                    {msg.timestamp}
                  </Text>
                  <View style={styles.messageBubbleMe}>
                    <Text style={[styles.messageText, styles.messageTextMe]}>
                      {msg.text}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  key={msg.id}
                  style={[styles.messageRow, styles.messageRowFromOther]}
                >
                  <View style={styles.otherAvatar}>
                    <Text style={styles.otherAvatarText}>
                      {name?.charAt(0) ?? "?"}
                    </Text>
                  </View>
                  <View style={styles.messageBubbleOther}>
                    <Text style={styles.messageText}>{msg.text}</Text>
                  </View>
                  <Text style={[styles.messageTime, styles.messageTimeAfterBubble]}>
                    {msg.timestamp}
                  </Text>
                </View>
              ),
            )}
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
          maxLength={500}
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
