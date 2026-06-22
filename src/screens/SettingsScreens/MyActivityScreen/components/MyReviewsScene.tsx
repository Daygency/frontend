import { useCallback, useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ReviewCard from "../../../../components/cards/ReviewCard";
import styles from "../styles";
import { getMyActivityReviewList } from "../../../../lib/apis/announcement/activityReviewApi";
import type { ActivityReviewListItem } from "../../../../lib/apis/announcement/activityReviewTypes";

const localStyles = StyleSheet.create({
  topSpacer: {
    height: 15,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginBottom: 9,
  },
});

function formatDate(iso?: string | null): string {
  if (!iso?.trim()) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function reactionLabel(rating: ActivityReviewListItem["rating"]): string {
  if (rating === "DISAPPOINTING") return "아쉬웠어요";
  if (rating === "GOOD") return "좋았어요";
  return "감동했어요";
}

const MyReviewsScene = () => {
  const [items, setItems] = useState<ActivityReviewListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadFirst = useCallback(async () => {
    setLoading(true);
    const res = await getMyActivityReviewList({ limit: 20 });
    if (!res) {
      setItems([]);
      setNextCursor(null);
      setHasMore(false);
      setLoading(false);
      return;
    }
    setItems(res.items);
    setNextCursor(res.nextCursor);
    setHasMore(res.hasMore);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadFirst();
  }, [loadFirst]);

  useFocusEffect(
    useCallback(() => {
      void loadFirst();
      return () => {};
    }, [loadFirst]),
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    const res = await getMyActivityReviewList({ cursor: nextCursor, limit: 20 });
    if (res) {
      setItems((prev) => [...prev, ...res.items]);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    }
    setLoadingMore(false);
  }, [hasMore, loadingMore, nextCursor]);

  if (loading) {
    return (
      <View style={styles.postsCommentsContainer}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color="#4B5563" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.postsCommentsContainer}>
      <View style={localStyles.topSpacer} />
      <FlatList
        style={{ flex: 1 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <View style={localStyles.cardWrapper}>
          <ReviewCard
            author={item.reviewee?.activityName || item.reviewee?.name || "상대"}
            date={formatDate(item.createdAt)}
            title={item.announcement?.title || item.postId}
            content={item.privateNoteToOps ?? undefined}
            reactionTag={reactionLabel(item.rating)}
            onOptionsPress={() => {}}
          />
        </View>
        )}
        onEndReached={() => void loadMore()}
        onEndReachedThreshold={0.4}
        contentContainerStyle={localStyles.listContent}
        ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>작성한 후기가 없습니다.</Text>
        </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator size="small" color="#4B5563" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default MyReviewsScene;
