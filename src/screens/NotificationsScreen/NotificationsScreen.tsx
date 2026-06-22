import { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import {
  getNotificationInbox,
  markAllNotificationsRead,
  markNotificationRecipientRead,
} from "../../lib/apis/notifications/notificationsApi";
import type { InboxRecipientItem } from "../../lib/apis/notifications/inboxTypes";
import { navigateFromInboxItem } from "../../lib/notifications/navigateFromInboxItem";
import { GRAY } from "../../color";
import styles from "./styles";

const PAGE_SIZE = 20;

function formatListTime(iso?: string): string {
  if (!iso?.trim()) return "";
  const created = new Date(iso);
  if (Number.isNaN(created.getTime())) return "";
  const diffMs = Date.now() - created.getTime();
  if (diffMs < 0) return "방금 전";
  const minMs = 60 * 1000;
  const hourMs = 60 * minMs;
  const dayMs = 24 * hourMs;
  if (diffMs < minMs) return "방금 전";
  if (diffMs < hourMs) return `${Math.floor(diffMs / minMs)}분 전`;
  if (diffMs < dayMs) return `${Math.max(1, Math.floor(diffMs / hourMs))}시간 전`;
  if (diffMs < dayMs * 7) return `${Math.floor(diffMs / dayMs)}일 전`;
  return `${created.getFullYear()}.${String(created.getMonth() + 1).padStart(2, "0")}.${String(created.getDate()).padStart(2, "0")}`;
}

function displayLine(item: InboxRecipientItem): string {
  const c = item.notice.content?.trim();
  if (c) return c;
  const name = item.notice.actor?.name?.trim() || "알림";
  switch (item.notice.targetType) {
    case "FOLLOW":
      return `${name}님이 회원님을 팔로우했습니다.`;
    case "APPLICATION":
      return `${name}님이 모집 공고에 지원했습니다.`;
    case "LIKE":
      return `${name}님이 좋아요를 눌렀습니다.`;
    case "COMMENT":
      return `${name}님이 댓글을 남겼습니다.`;
    case "REVIEW":
      return `${name}님이 활동 후기를 남겼습니다.`;
    case "INQUIRY":
      return "고객센터 문의에 답변이 등록되었습니다.";
    default:
      return "새 알림이 있습니다.";
  }
}

const NotificationsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const { isLoggedIn, user } = useAuth();
  const [items, setItems] = useState<InboxRecipientItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const unreadCount = items.filter((i) => i.readAt == null).length;

  const fetchFirst = useCallback(async () => {
    if (!isLoggedIn) {
      setItems([]);
      setLoading(false);
      setLoadError(false);
      return;
    }
    setLoadError(false);
    const res = await getNotificationInbox({ limit: PAGE_SIZE });
    if (!res) {
      setItems([]);
      setLoadError(true);
      setCursor(null);
      setHasMore(false);
      setLoading(false);
      return;
    }
    setItems(res.items);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
    setLoading(false);
  }, [isLoggedIn]);

  const onRefresh = useCallback(async () => {
    if (!isLoggedIn) return;
    setRefreshing(true);
    await fetchFirst();
    setRefreshing(false);
  }, [isLoggedIn, fetchFirst]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void fetchFirst();
    }, [fetchFirst]),
  );

  const loadMore = useCallback(async () => {
    if (!isLoggedIn || !hasMore || loadingMore || !cursor) return;
    setLoadingMore(true);
    const res = await getNotificationInbox({ cursor, limit: PAGE_SIZE });
    if (res) {
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  }, [isLoggedIn, hasMore, loadingMore, cursor]);

  const handleMarkAllRead = useCallback(async () => {
    if (!isLoggedIn || unreadCount === 0) return;
    const res = await markAllNotificationsRead();
    if (res) {
      setItems((prev) =>
        prev.map((row) =>
          row.readAt == null
            ? { ...row, readAt: new Date().toISOString() }
            : row,
        ),
      );
    }
  }, [isLoggedIn, unreadCount]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight:
        unreadCount > 0
          ? () => (
              <Pressable
                onPress={() => void handleMarkAllRead()}
                hitSlop={12}
                style={{ marginRight: 4 }}
              >
                <Text style={{ fontSize: 15, color: "#2563EB" }}>모두 읽음</Text>
              </Pressable>
            )
          : undefined,
    });
  }, [navigation, unreadCount, handleMarkAllRead]);

  const onPressRow = useCallback(
    async (row: InboxRecipientItem) => {
      if (row.readAt == null) {
        const ok = await markNotificationRecipientRead(row.recipientId);
        if (ok) {
          setItems((prev) =>
            prev.map((r) =>
              r.recipientId === row.recipientId
                ? { ...r, readAt: new Date().toISOString() }
                : r,
            ),
          );
        }
      }
      await navigateFromInboxItem(navigation, row, {
        currentUserId: user?.socialId,
      });
    },
    [navigation, user?.socialId],
  );

  if (!isLoggedIn) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.centerText}>
          로그인 후 알림 목록을 확인할 수 있습니다.
        </Text>
      </View>
    );
  }

  if (loading && items.length === 0) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={GRAY.DARK} />
      </View>
    );
  }

  if (loadError && items.length === 0) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.centerText}>
          알림을 불러오지 못했습니다.
        </Text>
        <Pressable
          onPress={() => {
            setLoading(true);
            void fetchFirst();
          }}
          style={{ marginTop: 16, paddingVertical: 10, paddingHorizontal: 20 }}
        >
          <Text style={{ fontSize: 15, color: "#2563EB" }}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.recipientId}
        contentContainerStyle={
          items.length === 0 ? styles.listContentEmpty : undefined
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => void loadMore()}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={40}
              color={GRAY.MEDIUM_2}
            />
            <Text style={[styles.centerText, { marginTop: 12 }]}>
              받은 알림이 없습니다.
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color={GRAY.DARK} />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const unread = item.readAt == null;
          const uri = item.notice.actor?.profileImgUrl?.trim();
          return (
            <Pressable
              style={[
                styles.row,
                unread ? styles.rowUnread : styles.rowRead,
              ]}
              onPress={() => void onPressRow(item)}
            >
              {uri ? (
                <Image source={{ uri }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={26}
                    color={GRAY.MEDIUM_2}
                  />
                </View>
              )}
              <View style={styles.body}>
                <Text
                  style={[
                    styles.title,
                    unread ? styles.titleUnread : styles.titleRead,
                  ]}
                >
                  {displayLine(item)}
                </Text>
                <Text
                  style={[
                    styles.meta,
                    unread ? styles.metaUnread : styles.metaRead,
                  ]}
                >
                  {formatListTime(item.notice.createdAt)}
                </Text>
              </View>
              {unread ? <View style={styles.unreadDot} /> : null}
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default NotificationsScreen;
