import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { AppState } from "react-native";
import type { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getChatUnreadCount } from "../lib/apis/chat/chatApi";
import { createChatSocket } from "../lib/chat/createChatSocket";
import {
  emitChatRoomUpdated,
  type ChatRoomUpdatedMessage,
} from "../lib/chat/chatRoomsEvents";

type ChatUnreadContextType = {
  /** 내가 속한 모든 채팅방의 안 읽은 메시지 총합 (하단 탭바 배지) */
  unreadCount: number;
  /** 방을 읽음 처리한 직후 등, 서버 응답을 기다리지 않고 즉시 재조회 */
  refresh: () => Promise<void>;
};

const ChatUnreadContext = createContext<ChatUnreadContextType | null>(null);

/**
 * `/chat` 네임스페이스에 상시 연결해 두고, 내가 속한 방에 새 메시지가 오면
 * 서버가 보내는 `chatUnreadChanged` 이벤트를 받아 총 안읽음 수를 갱신한다.
 * (그룹 채팅으로 확장돼도 서버가 room 멤버 전원에게 동일 이벤트를 쏘므로 그대로 동작)
 */
export const ChatUnreadProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const refresh = useCallback(async () => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }
    const count = await getChatUnreadCount();
    if (count != null) setUnreadCount(count);
  }, [isLoggedIn]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  useEffect(() => {
    if (!isLoggedIn) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    let cancelled = false;
    (async () => {
      const socket = await createChatSocket();
      if (cancelled || !socket) return;
      socketRef.current = socket;
      socket.on(
        "chatUnreadChanged",
        (data?: { chatRoomId?: string; message?: ChatRoomUpdatedMessage }) => {
          void refresh();
          if (data?.chatRoomId) {
            emitChatRoomUpdated({
              chatRoomId: data.chatRoomId,
              message: data.message ?? null,
            });
          }
        },
      );
    })();

    return () => {
      cancelled = true;
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn, refresh]);

  return (
    <ChatUnreadContext.Provider value={{ unreadCount, refresh }}>
      {children}
    </ChatUnreadContext.Provider>
  );
};

export const useChatUnread = () => {
  const context = useContext(ChatUnreadContext);
  if (!context) {
    throw new Error("useChatUnread must be used within ChatUnreadProvider");
  }
  return context;
};
