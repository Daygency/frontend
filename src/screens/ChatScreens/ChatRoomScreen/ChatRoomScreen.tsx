import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useChatUnread } from "../../../contexts/ChatUnreadContext";
import { RootRoutes } from "../../../navigations/routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  commentInputBarPaddingBottom,
  useKeyboardHeight,
} from "../../../hooks/useKeyboardHeight";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../../color";
import styles from "./styles";
import {
  getChatMessages,
  markChatRoomRead,
  sendChatFileMessage,
  sendChatFilesMessage,
} from "../../../lib/apis/chat/chatApi";
import type { ChatFileItem } from "../../../lib/apis/chat/types";
import { resolveProfileImageUrlForDisplay } from "../../../lib/chat/resolveProfileImageUrl";
import { findMessageMatchIndices } from "../../../lib/chat/chatSearch";
import { createChatSocket } from "../../../lib/chat/createChatSocket";
import UserProfileAvatar from "../../../components/ui/UserProfileAvatar";
import HighlightText from "../../../components/ui/HighlightText";
import { useImageViewer } from "../../../contexts/ImageViewerContext";
import type { Socket } from "socket.io-client";
import {
  cacheChatFile,
  openChatCachedFile,
} from "../../../lib/chat/chatFileCache";
import ChatImageMessage from "./ChatImageMessage";

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
  fileUrl?: string | null;
  fileName?: string | null;
  fileMime?: string | null;
  fileItems?: ChatFileItem[] | null;
};

type WsMessagePayload = {
  id?: string;
  chatRoomId?: string;
  chat_room_id?: string;
  userId?: string;
  user_id?: string;
  content?: string | null;
  fileUrl?: string | null;
  file_url?: string | null;
  fileName?: string | null;
  file_name?: string | null;
  originalName?: string | null;
  original_name?: string | null;
  fileMime?: string | null;
  file_mime?: string | null;
  fileItems?: unknown;
  file_items?: unknown;
  createdAt?: string;
  created_at?: string;
};

const isImageMime = (mime?: string | null) =>
  Boolean(mime?.startsWith("image/"));

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const pickRawString = (
  raw: Record<string, unknown>,
  camelKey: string,
  snakeKey: string,
) => {
  const camelValue = raw[camelKey];
  if (typeof camelValue === "string") return camelValue;
  const snakeValue = raw[snakeKey];
  return typeof snakeValue === "string" ? snakeValue : null;
};

const PREVIEWABLE_DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
];

const PREVIEWABLE_DOCUMENT_MIME_KEYWORDS = [
  "pdf",
  "powerpoint",
  "presentation",
  "msword",
  "wordprocessingml",
  "excel",
  "spreadsheetml",
];

const isPreviewableDocumentFile = (
  fileName?: string | null,
  mime?: string | null,
  url?: string | null,
) => {
  const normalizedMime = mime?.toLowerCase() ?? "";
  if (
    PREVIEWABLE_DOCUMENT_MIME_KEYWORDS.some((keyword) =>
      normalizedMime.includes(keyword),
    )
  ) {
    return true;
  }
  const name = fileName?.toLowerCase() ?? "";
  if (PREVIEWABLE_DOCUMENT_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return true;
  }
  const cleanUrl = url?.split("?")[0]?.split("#")[0]?.toLowerCase() ?? "";
  return PREVIEWABLE_DOCUMENT_EXTENSIONS.some((ext) => cleanUrl.endsWith(ext));
};

const normalizeFileName = (value: string) =>
  typeof value.normalize === "function" ? value.normalize("NFC") : value;

const decodeFileName = (value: string) => {
  let decoded = value;
  for (let i = 0; i < 5; i += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  const withoutQuery = decoded.split("?")[0]?.split("#")[0] ?? decoded;
  const fileName =
    withoutQuery.split(/[\\/]/).filter(Boolean).pop() ?? withoutQuery;
  return normalizeFileName(fileName).trim();
};

const cleanFileName = (value?: string | null) => {
  const cleaned = value?.replace(/^\[파일\]\s*/, "").trim();
  return cleaned ? decodeFileName(cleaned) : null;
};

const fileNameFromUrl = (value?: string | null) => {
  if (!value?.trim()) return null;
  const withoutQuery = value.split("?")[0]?.split("#")[0] ?? "";
  const lastSegment = withoutQuery.split("/").filter(Boolean).pop();
  if (!lastSegment) return null;
  return decodeFileName(lastSegment);
};

const normalizeMessageFileItems = (value: unknown): ChatFileItem[] | null => {
  if (!Array.isArray(value)) return null;
  const items = value
    .map((item) => {
      const raw = asRecord(item);
      const fileUrl = pickRawString(raw, "fileUrl", "file_url");
      if (!fileUrl) return null;
      const fileName =
        cleanFileName(pickRawString(raw, "fileName", "file_name")) ??
        cleanFileName(pickRawString(raw, "originalName", "original_name")) ??
        fileNameFromUrl(fileUrl) ??
        "파일";
      const fileMime = pickRawString(raw, "fileMime", "file_mime");
      return { fileUrl, fileName, fileMime };
    })
    .filter(Boolean) as ChatFileItem[];
  return items.length > 0 ? items : null;
};

const pickMessageFileName = (message: Pick<MessageItem, "text" | "fileUrl" | "fileName">) =>
  cleanFileName(message.fileName) ??
  cleanFileName(message.text) ??
  fileNameFromUrl(message.fileUrl) ??
  "파일";

const mapToMessageItem = (
  m: WsMessagePayload,
  myUserId: string,
  peerUserId: string,
): MessageItem | null => {
  const id = String(m.id ?? "");
  const createdAt = m.createdAt ?? m.created_at;
  if (!id || !createdAt) return null;
  const uid = String(m.userId ?? m.user_id ?? "");
  const fileItems = normalizeMessageFileItems(m.fileItems ?? m.file_items);
  const firstFileItem = fileItems?.[0] ?? null;
  const fileUrl = m.fileUrl ?? m.file_url ?? firstFileItem?.fileUrl ?? null;
  const fileName =
    cleanFileName(m.fileName) ??
    cleanFileName(m.file_name) ??
    cleanFileName(m.originalName) ??
    cleanFileName(m.original_name) ??
    firstFileItem?.fileName ??
    fileNameFromUrl(fileUrl);
  const fileMime = m.fileMime ?? m.file_mime ?? firstFileItem?.fileMime ?? null;
  return {
    id,
    text: m.content ?? "",
    isFromMe: myUserId ? uid === myUserId : uid !== String(peerUserId),
    timestamp: formatTime(new Date(createdAt)),
    fileUrl,
    fileName,
    fileMime,
    fileItems,
  };
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
  const { refresh: refreshChatUnread } = useChatUnread();
  const isFocused = useIsFocused();
  const { top, bottom } = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const isKeyboardVisible = keyboardHeight > 0;
  const {
    chatRoomId = "",
    peerUserId: peerUserIdParam = "",
    name,
    handle = "",
    isOnline = false,
    peerAvatarUrl: peerAvatarUrlParam,
  } = route.params ?? {};

  const myUserId = String(user?.socialId ?? "");
  const { openImageViewer } = useImageViewer();
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

  const peerAvatarUrl = peerAvatarUrlParam;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendReady, setSendReady] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
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

  /** 방을 열람 중일 때만 읽음 처리 — 배경 탭에 머무는 동안은 안읽음 그대로 유지 */
  const markRead = useCallback(
    (lastMessageId?: string) => {
      if (!chatRoomId || !isFocused) return;
      void markChatRoomRead(chatRoomId, lastMessageId).then((ok) => {
        if (ok) void refreshChatUnread();
      });
    },
    [chatRoomId, isFocused, refreshChatUnread],
  );

  const appendFromSocket = useCallback(
    (payload: WsMessagePayload) => {
      const item = mapToMessageItem(payload, myUserId, peerUserId);
      if (!item) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === item.id)) {
          return prev.map((message) =>
            message.id === item.id
              ? {
                  ...message,
                  text: message.text || item.text,
                  fileUrl: message.fileUrl ?? item.fileUrl,
                  fileName: message.fileName ?? item.fileName,
                  fileMime: message.fileMime ?? item.fileMime,
                  fileItems: message.fileItems ?? item.fileItems,
                }
              : message,
          );
        }
        return [...prev, item];
      });
      if (!item.isFromMe) {
        markRead(item.id);
      }
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    },
    [peerUserId, myUserId, markRead],
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
          fileUrl: m.fileUrl ?? null,
          fileName: m.fileName ?? null,
          fileMime: m.fileMime ?? null,
          fileItems: m.fileItems ?? null,
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

  /** 방 진입/재진입 시 읽음 처리 (탭 전환 후 되돌아오는 경우 포함) */
  useFocusEffect(
    useCallback(() => {
      markRead();
    }, [markRead]),
  );

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

  const uploadAndSendFile = async (
    uri: string,
    opts: { name?: string; type?: string },
  ) => {
    if (!chatRoomId || fileUploading) return;
    setFileUploading(true);
    try {
      const sent = await sendChatFileMessage(chatRoomId, uri, opts);
      if (!sent) {
        Alert.alert(
          "전송 실패",
          "파일을 보내지 못했습니다. 다시 시도해 주세요.",
        );
        return;
      }
      appendFromSocket(sent);
    } catch {
      Alert.alert("오류", "파일을 전송하는 중 오류가 발생했습니다.");
    } finally {
      setFileUploading(false);
    }
  };

  const uploadAndSendFiles = async (
    files: Array<{ uri: string; name?: string; type?: string }>,
  ) => {
    if (!chatRoomId || fileUploading || files.length === 0) return;
    setFileUploading(true);
    try {
      const sent = await sendChatFilesMessage(chatRoomId, files);
      if (!sent) {
        Alert.alert(
          "전송 실패",
          "사진을 보내지 못했습니다. 다시 시도해 주세요.",
        );
        return;
      }
      appendFromSocket(sent);
    } catch {
      Alert.alert("오류", "사진을 전송하는 중 오류가 발생했습니다.");
    } finally {
      setFileUploading(false);
    }
  };

  const handlePickAlbum = async () => {
    setIsAttachmentMenuOpen(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "사진을 보내려면 앨범 접근 권한이 필요합니다.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.85,
      });
      if (result.canceled || !result.assets?.length) return;
      const files = result.assets.slice(0, 10).map((asset, index) => ({
        uri: asset.uri,
        name: asset.fileName ?? `image_${Date.now()}_${index + 1}.jpg`,
        type: asset.mimeType ?? "image/jpeg",
      }));
      if (files.length === 1) {
        await uploadAndSendFile(files[0].uri, {
          name: files[0].name,
          type: files[0].type,
        });
        return;
      }
      await uploadAndSendFiles(files);
    } catch {
      Alert.alert("오류", "사진을 선택하는 중 오류가 발생했습니다.");
    }
  };

  const handlePickFile = async () => {
    setIsAttachmentMenuOpen(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      await uploadAndSendFile(asset.uri, {
        name: asset.name,
        type: asset.mimeType ?? "application/octet-stream",
      });
    } catch {
      Alert.alert("오류", "파일을 선택하는 중 오류가 발생했습니다.");
    }
  };

  const openFileUrl = async (
    url?: string | null,
    fileName?: string | null,
    fileMime?: string | null,
  ) => {
    const resolved = resolveProfileImageUrlForDisplay(url);
    if (!resolved) return;
    if (isPreviewableDocumentFile(fileName, fileMime, resolved)) {
      void cacheChatFile({ url: resolved, fileName, fileMime }).catch(() => {
        // Cache is best-effort; remote preview should still open.
      });
      navigation.navigate(RootRoutes.PDF_VIEWER, {
        url: resolved,
        title: fileName?.trim() || "파일 보기",
      });
      return;
    }

    let cachedFile: Awaited<ReturnType<typeof cacheChatFile>> | null = null;
    try {
      cachedFile = await cacheChatFile({ url: resolved, fileName, fileMime });
    } catch {
      // Cache is best-effort; opening the file should still work.
    }
    try {
      if (cachedFile) {
        await openChatCachedFile(cachedFile);
      } else {
        await Linking.openURL(resolved);
      }
    } catch {
      Alert.alert("열기 실패", "파일을 열 수 없습니다.");
    }
  };

  const displayHandle = handle.startsWith("@") ? handle : `@${handle}`;

  const inputBarPaddingBottom = commentInputBarPaddingBottom(keyboardHeight, bottom);

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
    <View style={[styles.container, { paddingTop: top }]}>
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
                <UserProfileAvatar
                  peerUserId={peerUserId || undefined}
                  profileImgUrl={peerAvatarUrl}
                  size={44}
                />
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
            onPress={() =>
              navigation.navigate(RootRoutes.CHAT_ROOM_OPTIONS, {
                chatRoomId,
                peerUserId,
                name,
              })
            }
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
              const imageGridItems = (msg.fileItems ?? [])
                .map((item, index) => ({
                  ...item,
                  index,
                  displayUrl: resolveProfileImageUrlForDisplay(item.fileUrl),
                }))
                .filter(
                  (item) => item.displayUrl && isImageMime(item.fileMime),
                ) as Array<ChatFileItem & { index: number; displayUrl: string }>;
              const hasImageGrid = imageGridItems.length > 1;
              const imageGridUrls = imageGridItems.map((item) => item.displayUrl);
              const hasFile = Boolean(
                msg.fileUrl || msg.fileName || (msg.fileItems?.length ?? 0) > 0,
              );
              const fileDisplayUrl = resolveProfileImageUrlForDisplay(msg.fileUrl);
              const showImage =
                !hasImageGrid && hasFile && isImageMime(msg.fileMime) && fileDisplayUrl;
              const showFileRow = hasFile && !showImage && !hasImageGrid;
              const showText = Boolean(msg.text?.trim()) && !hasFile;
              const fileDisplayName = pickMessageFileName(msg);

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

              const bubbleContent = (
                <>
                  {hasImageGrid ? (
                    <View style={styles.messageImageGrid}>
                      {imageGridItems.map((item, imageIndex) => (
                        <Pressable
                          key={`${item.fileUrl}-${imageIndex}`}
                          style={[
                            styles.messageImageGridItem,
                            imageGridItems.length === 3 &&
                              imageIndex === 0 &&
                              styles.messageImageGridItemWide,
                          ]}
                          onPress={() => openImageViewer(imageGridUrls, imageIndex)}
                        >
                          <Image
                            source={{ uri: item.displayUrl }}
                            style={styles.messageImageGridImage}
                            resizeMode="cover"
                          />
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                  {showImage ? (
                    <ChatImageMessage
                      uri={fileDisplayUrl}
                      onPress={() => openImageViewer(fileDisplayUrl)}
                    />
                  ) : null}
                  {showFileRow ? (
                    <Pressable
                      style={styles.messageFileRow}
                      onPress={() =>
                        openFileUrl(msg.fileUrl, fileDisplayName, msg.fileMime)
                      }
                    >
                      <MaterialCommunityIcons
                        name="file-outline"
                        size={22}
                        color={msg.isFromMe ? WHITE : GRAY.DARK_100}
                      />
                      <Text
                        style={[
                          styles.messageFileName,
                          msg.isFromMe && styles.messageTextMe,
                        ]}
                        numberOfLines={2}
                      >
                        {fileDisplayName}
                      </Text>
                    </Pressable>
                  ) : null}
                  {showText ? textContent : null}
                </>
              );

              const bubbleStyle = showImage || hasImageGrid
                ? msg.isFromMe
                  ? [styles.messageBubbleMe, styles.messageBubbleMedia]
                  : [styles.messageBubbleOther, styles.messageBubbleMedia]
                : msg.isFromMe
                  ? styles.messageBubbleMe
                  : styles.messageBubbleOther;

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
                  <View style={bubbleStyle}>{bubbleContent}</View>
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
                    <UserProfileAvatar
                      peerUserId={peerUserId || undefined}
                      profileImgUrl={peerAvatarUrl}
                      size={32}
                    />
                  </View>
                  <View style={bubbleStyle}>{bubbleContent}</View>
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
        <View style={[styles.attachmentMenu, { paddingBottom: Math.max(bottom, 8) }]}>
          <Pressable
            style={styles.attachmentOption}
            onPress={handlePickAlbum}
            disabled={fileUploading}
          >
            <View style={[styles.attachmentIconCircle, { backgroundColor: "rgba(76, 175, 80, 0.15)" }]}>
              <MaterialCommunityIcons
                name="image-multiple-outline"
                size={28}
                color="#4CAF50"
              />
            </View>
            <Text style={styles.attachmentLabel}>앨범</Text>
          </Pressable>
          <Pressable
            style={styles.attachmentOption}
            onPress={handlePickFile}
            disabled={fileUploading}
          >
            <View style={[styles.attachmentIconCircle, { backgroundColor: "rgba(33, 150, 243, 0.15)" }]}>
              <MaterialCommunityIcons
                name="file-outline"
                size={28}
                color="#2196F3"
              />
            </View>
            <Text style={styles.attachmentLabel}>파일</Text>
          </Pressable>
        </View>
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: inputBarPaddingBottom }]}>
        {fileUploading ? (
          <View style={styles.uploadingRow}>
            <ActivityIndicator size="small" color={MAIN.DEFAULT} />
            <Text style={styles.uploadingText}>파일 전송 중...</Text>
          </View>
        ) : null}
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
          placeholder={sendReady ? "메시지를 입력하세요" : "연결 중..."}
          placeholderTextColor={GRAY.DARK_2}
          multiline
          maxLength={255}
          scrollEnabled={isKeyboardVisible}
          blurOnSubmit={false}
          returnKeyType="send"
          autoCorrect={false}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="sentences"
          textContentType="none"
          importantForAutofill="no"
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
    </View>
  );
};

export default ChatRoomScreen;
