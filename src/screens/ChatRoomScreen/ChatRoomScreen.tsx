import { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootRoutes } from "../../navigations/routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { GRAY, WHITE } from "../../color";
import styles from "./styles";

export type ChatRoomParams = {
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

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const h = hours % 12 || 12;
  return `${ampm} ${h}:${minutes.toString().padStart(2, "0")}`;
};

const ChatRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ ChatRoom: ChatRoomParams }, "ChatRoom">>();
  const { top, bottom } = useSafeAreaInsets();
  const { name, handle = "", isOnline = false } = route.params ?? {};

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "1",
      text: "다음주 오디션 일정이 어떻게 되나요?",
      isFromMe: true,
      timestamp: "오전 9:33",
    },
    {
      id: "2",
      text: "10월 15일 14시로 확정되었습니다. 장소는 강남 연습실입니다.",
      isFromMe: false,
      timestamp: "오전 9:35",
    },
    {
      id: "3",
      text: "감사합니다! 준비해서 가겠습니다.",
      isFromMe: true,
      timestamp: "오전 9:36",
    },
  ]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const newMsg: MessageItem = {
      id: Date.now().toString(),
      text: trimmed,
      isFromMe: true,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, newMsg]);
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
            )
          )}
        </ScrollView>
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
          placeholder="메시지를 입력하세요"
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
          disabled={!message.trim()}
          onPress={sendMessage}
        >
          <MaterialCommunityIcons
            name="send"
            size={22}
            color={message.trim() ? "#000" : GRAY.DARK_2}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
