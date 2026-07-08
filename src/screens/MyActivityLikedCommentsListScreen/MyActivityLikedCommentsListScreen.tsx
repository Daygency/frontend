import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CommunityCard from "../LoungeScreen/components/CommunityCard";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import styles from "./styles";
import { RootRoutes } from "../../navigations/routes";
import { getMyLikedComments } from "../../lib/apis/like/myLikesApi";
import type { MyLikedCommentItem } from "../../lib/apis/like/types";

type RootStackParamList = {
  CommunityDetail: { communityId: string };
  MusicNewsDetail: { newsId: string };
};

type CommentRow = {
  id: string;
  title: string;
  contentPreview: string;
  date: string;
  targetType: "NEWS" | "COMMUNITY";
  targetId: string;
};

const MyActivityLikedCommentsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<MyLikedCommentItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFirst = useCallback(async () => {
    const res = await getMyLikedComments({ limit: 20 });
    if (!res) {
      setItems([]);
      setNextCursor(null);
      setHasMore(false);
      return;
    }
    setItems(res.items);
    setNextCursor(res.nextCursor);
    setHasMore(res.hasMore);
  }, []);

  useEffect(() => {
    void fetchFirst();
  }, [fetchFirst]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFirst();
    setRefreshing(false);
  }, [fetchFirst]);

  const data = useMemo(
    (): CommentRow[] =>
      items.map((item) => ({
        id: item.likeId,
        title: item.postTitle?.trim() || "댓글 단 글",
        contentPreview: item.content,
        date: formatDate(item.likedAt),
        targetType: item.targetType,
        targetId: item.targetId,
      })),
    [items],
  );

  const handleRowPress = (item: CommentRow) => {
    if (item.targetType === "NEWS") {
      navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, { newsId: item.targetId });
      return;
    }
    navigation.navigate(RootRoutes.COMMUNITY_DETAIL, { communityId: item.targetId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
        }
        renderItem={({ item }) => (
          <CommunityCard
            title={item.title}
            contentPreview={item.contentPreview}
            author="나"
            date={item.date}
            likes={0}
            comments={0}
            onPress={() => handleRowPress(item)}
          />
        )}
        contentContainerStyle={contentContainerWhenEmpty(
          data.length === 0,
          styles.listContent,
        )}
        onEndReachedThreshold={0.4}
        onEndReached={async () => {
          if (loadingMore || !hasMore || !nextCursor) return;
          setLoadingMore(true);
          const res = await getMyLikedComments({
            limit: 20,
            cursor: nextCursor ?? undefined,
          });
          if (res) {
            setItems((prev) => {
              const seen = new Set(prev.map((row) => row.likeId));
              const appended = res.items.filter((row) => !seen.has(row.likeId));
              return [...prev, ...appended];
            });
            setNextCursor(res.nextCursor);
            setHasMore(res.hasMore);
          }
          setLoadingMore(false);
        }}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>불러오는 중...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={<EmptyState message="좋아요한 댓글이 없습니다." />}
      />
    </View>
  );
};

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default MyActivityLikedCommentsListScreen;
