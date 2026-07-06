import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { AppState } from "react-native";
import { useAuth } from "./AuthContext";
import { getNotificationUnreadCount } from "../lib/apis/notifications/notificationsApi";

type NotificationUnreadContextType = {
  /** 안 읽은 알림 총 개수 (상단바 배지) */
  unreadCount: number;
  /** 서버 응답을 기다리지 않고 즉시 재조회 */
  refresh: () => Promise<void>;
  /** 모두읽기 등, 응답을 이미 알고 있을 때 즉시 반영 */
  setUnreadCount: Dispatch<SetStateAction<number>>;
};

const NotificationUnreadContext =
  createContext<NotificationUnreadContextType | null>(null);

export const NotificationUnreadProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isLoggedIn } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }
    const count = await getNotificationUnreadCount();
    if (count != null) setUnreadCount(Math.max(0, count));
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

  return (
    <NotificationUnreadContext.Provider
      value={{ unreadCount, refresh, setUnreadCount }}
    >
      {children}
    </NotificationUnreadContext.Provider>
  );
};

export const useNotificationUnread = () => {
  const context = useContext(NotificationUnreadContext);
  if (!context) {
    throw new Error(
      "useNotificationUnread must be used within NotificationUnreadProvider",
    );
  }
  return context;
};
