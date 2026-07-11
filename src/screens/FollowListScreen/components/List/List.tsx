import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  getUserFollowersList,
  getUserFollowingList,
} from "../../../../lib/apis/follow/followApi";
import type { FollowListItemDto } from "../../../../lib/apis/follow/followListTypes";
import PersonItem from "../PersonItem/PersonItem";
import EmptyState, { contentContainerWhenEmpty } from "../../../../components/ui/EmptyState";
import styles from "./styles";

type ListMode = "following" | "follower";

interface ListProps {
  type: ListMode;
  userId: string;
}

const PAGE_SIZE = 8;

const List = ({ type, userId }: ListProps) => {
  const [items, setItems] = useState<FollowListItemDto[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchFirst = useCallback(async () => {
    const id = userId?.trim();
    if (!id) {
      setItems([]);
      setCursor(null);
      setHasMore(false);
      setLoading(false);
      setLoadError(true);
      return;
    }
    setLoading(true);
    setLoadError(false);
    const fn =
      type === "following" ? getUserFollowingList : getUserFollowersList;
    const res = await fn(id, { limit: PAGE_SIZE });
    setLoading(false);
    if (!res) {
      setItems([]);
      setCursor(null);
      setHasMore(false);
      setLoadError(true);
      return;
    }
    setItems(res.items);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  }, [userId, type]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFirst();
    setRefreshing(false);
  }, [fetchFirst]);

  useEffect(() => {
    void fetchFirst();
  }, [fetchFirst]);

  const onEndReached = useCallback(async () => {
    const id = userId?.trim();
    if (!id || !hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const fn =
      type === "following" ? getUserFollowingList : getUserFollowersList;
    const res = await fn(id, { cursor, limit: PAGE_SIZE });
    setLoadingMore(false);
    if (!res) return;
    setItems((prev) => {
      const seen = new Set(prev.map((p) => p.userId));
      const merged = [...prev];
      for (const it of res.items) {
        if (!seen.has(it.userId)) {
          seen.add(it.userId);
          merged.push(it);
        }
      }
      return merged;
    });
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  }, [userId, type, cursor, hasMore, loadingMore, loading]);

  if (!userId?.trim()) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>사용자 정보가 없습니다.</Text>
      </View>
    );
  }

  if (loading && items.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1F2A44" />
      </View>
    );
  }

  if (loadError && items.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>
          목록을 불러오지 못했습니다.{"\n"}다시 시도해 주세요.
        </Text>
        <Pressable
          style={styles.retryBtn}
          onPress={() => void fetchFirst()}
        >
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(item) => item.userId}
      renderItem={({ item }) => <PersonItem person={item} />}
      contentContainerStyle={contentContainerWhenEmpty(
        items.length === 0,
        styles.listContent,
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.35}
      ListEmptyComponent={
        <EmptyState
          message={
            type === "following"
              ? "팔로잉한 사용자가 없습니다."
              : "팔로워가 없습니다."
          }
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color="#1F2A44" />
          </View>
        ) : null
      }
    />
  );
};

export default List;
