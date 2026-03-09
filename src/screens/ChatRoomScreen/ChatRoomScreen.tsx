import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { GRAY, WHITE } from "../../color";
import styles from "./styles";

export type ChatRoomParams = {
  name: string;
  handle: string;
  isOnline?: boolean;
};

const ChatRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ ChatRoom: ChatRoomParams }, "ChatRoom">>();
  const { top, bottom } = useSafeAreaInsets();
  const { name, handle = "", isOnline = false } = route.params ?? {};

  const [message, setMessage] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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

        <Pressable hitSlop={10} style={styles.moreButton}>
          <MaterialCommunityIcons name="dots-vertical" size={22} color="#000" />
        </Pressable>
      </View>

      {/* Message area */}
      <ScrollView
        style={styles.messageArea}
        contentContainerStyle={styles.messageAreaContent}
        keyboardShouldPersistTaps="handled"
      />

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: inputBarPaddingBottom }]}>
        <Pressable style={styles.addButton}>
          <Feather name="plus" size={22} color="#666" />
        </Pressable>
        <TextInput
          style={[
            styles.input,
            !isKeyboardVisible && styles.inputSingleLine,
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요"
          placeholderTextColor={GRAY.DARK_2}
          multiline
          maxLength={500}
          scrollEnabled={isKeyboardVisible}
        />
        <Pressable
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!message.trim()}
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
