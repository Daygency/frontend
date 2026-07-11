import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CommunityCard from "../LoungeScreen/components/CommunityCard";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import styles from "./styles";
import { RootRoutes } from "../../navigations/routes";
import { getMyPosts, getMyComments } from "../../lib/apis/userPosts/myPostsApi";
import type { MyCommunityPostItem, MyCommentPostItem } from "../../lib/apis/userPosts/types";
import { getMyScrappedCommunity } from "../../lib/apis/scrap/scrapApi";
import type { MyScrappedCommunityItem } from "../../lib/apis/scrap/types";
import { getMyLikedCommunity } from "../../lib/apis/like/myLikesApi";
import type { MyLikedCommunityItem } from "../../lib/apis/like/types";
import { normalizeListThumbnailUrl } from "../../lib/media/listThumbnailUrl";

type MyActivityListParams = {
  type: "posts" | "comments";
  source?: "scrap" | "like";
};

type RootStackParamList = {
  MyActivityList: MyActivityListParams;
  CommunityDetail: { communityId: string };
  MusicNewsDetail: { newsId: string };
};

type CommunityRow = {
  id: string;
  title: string;
  contentPreview: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  scraps: number;
  views?: number;
  thumbnailUrl?: string;
  targetType?: "NEWS" | "COMMUNITY";
  targetId?: string;
};

const MyActivityListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "MyActivityList">>();
  const { type, source } = route.params;
  const [myCommunityPosts, setMyCommunityPosts] = useState<MyCommunityPostItem[]>([]);
  const [myComments, setMyComments] = useState<MyCommentPostItem[]>([]);
  const [scrappedCommunity, setScrappedCommunity] = useState<MyScrappedCommunityItem[]>([]);
  const [likedCommunity, setLikedCommunity] = useState<MyLikedCommunityItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFirst = useCallback(async () => {
    if (type === "comments") {
      const res = await getMyComments({ limit: 8 });
      if (!res) {
        setMyComments([]);
        setNextCursor(null);
        setHasMore(false);
        return;
      }
      setMyComments(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
      return;
    }

    if (source === "scrap") {
      const res = await getMyScrappedCommunity({ limit: 8 });
      if (!res) {
        setScrappedCommunity([]);
        setNextCursor(null);
        setHasMore(false);
        return;
      }
      setScrappedCommunity(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
      return;
    }

    if (source === "like") {
      const res = await getMyLikedCommunity({ limit: 8 });
      if (!res) {
        setLikedCommunity([]);
        setNextCursor(null);
        setHasMore(false);
        return;
      }
      setLikedCommunity(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
      return;
    }

    const res = await getMyPosts({ limit: 8 });
    if (!res) {
      setMyCommunityPosts([]);
      setNextCursor(null);
      setHasMore(false);
      return;
    }
    setMyCommunityPosts(res.community.items);
    setNextCursor(res.community.nextCursor);
    setHasMore(res.community.hasMore);
  }, [type, source]);

  useEffect(() => {
    void fetchFirst();
  }, [fetchFirst]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFirst();
    setRefreshing(false);
  }, [fetchFirst]);

  const myPostsData = useMemo(
    (): CommunityRow[] =>
      myCommunityPosts.map((item) => ({
        id: item.communityId,
        title: item.title,
        contentPreview: item.category ?? "",
        author: "나",
        date: formatDate(item.createdAt),
        likes: Number(item.likeCount ?? 0),
        comments: Number(item.commentCount ?? 0),
        scraps: 0,
        views: Number(item.viewCount ?? 0),
        thumbnailUrl: normalizeListThumbnailUrl(item.thumbnailUrl),
        targetType: "COMMUNITY",
        targetId: item.communityId,
      })),
    [myCommunityPosts],
  );

  const myCommentsData = useMemo(
    (): CommunityRow[] =>
      myComments.map((item) => ({
        id: item.commentId,
        title: item.postTitle?.trim() || "댓글 단 글",
        contentPreview: item.content,
        author: "나",
        date: formatDate(item.createdAt),
        likes: 0,
        comments: 0,
        scraps: 0,
        targetType: item.targetType,
        targetId: item.targetId,
      })),
    [myComments],
  );

  const scrappedPostsData = useMemo(
    (): CommunityRow[] =>
      scrappedCommunity.map((item) => ({
        id: item.communityId,
        title: item.title,
        contentPreview: item.category ?? "",
        author: "나",
        date: formatDate(item.createdAt),
        likes: Number(item.likeCount ?? 0),
        comments: Number(item.commentCount ?? 0),
        scraps: 0,
        views: Number(item.viewCount ?? 0),
        thumbnailUrl: normalizeListThumbnailUrl(item.thumbnailUrl),
        targetType: "COMMUNITY",
        targetId: item.communityId,
      })),
    [scrappedCommunity],
  );

  const likedPostsData = useMemo(
    (): CommunityRow[] =>
      likedCommunity.map((item) => ({
        id: item.communityId,
        title: item.title,
        contentPreview: item.category ?? "",
        author: "나",
        date: formatDate(item.createdAt),
        likes: Number(item.likeCount ?? 0),
        comments: Number(item.commentCount ?? 0),
        scraps: 0,
        views: Number(item.viewCount ?? 0),
        thumbnailUrl: normalizeListThumbnailUrl(item.thumbnailUrl),
        targetType: "COMMUNITY",
        targetId: item.communityId,
      })),
    [likedCommunity],
  );

  const data: CommunityRow[] =
    type === "posts"
      ? source === "scrap"
        ? scrappedPostsData
        : source === "like"
          ? likedPostsData
          : myPostsData
      : myCommentsData;

  const getEmptyMessage = () => {
    if (source === "scrap") return "스크랩한 글이 없습니다.";
    if (source === "like") return "좋아요한 글이 없습니다.";
    return type === "posts" ? "작성한 글이 없습니다." : "작성한 댓글이 없습니다.";
  };

  const handleRowPress = (item: CommunityRow) => {
    if (type === "comments") {
      if (item.targetType === "NEWS" && item.targetId) {
        navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, { newsId: item.targetId });
        return;
      }
      if (item.targetType === "COMMUNITY" && item.targetId) {
        navigation.navigate(RootRoutes.COMMUNITY_DETAIL, { communityId: item.targetId });
      }
      return;
    }
    navigation.navigate(RootRoutes.COMMUNITY_DETAIL, { communityId: item.id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommunityCard
            title={item.title}
            contentPreview={item.contentPreview}
            author={item.author}
            date={item.date}
            likes={item.likes}
            comments={item.comments}
            scraps={item.scraps}
            views={item.views}
            thumbnailUrl={item.thumbnailUrl}
            onPress={() => handleRowPress(item)}
          />
        )}
        contentContainerStyle={contentContainerWhenEmpty(
          data.length === 0,
          styles.listContent,
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
        }
        onEndReachedThreshold={0.4}
        onEndReached={async () => {
          if (loadingMore || !hasMore) return;
          setLoadingMore(true);
          if (type === "comments") {
            const res = await getMyComments({
              limit: 8,
              cursor: nextCursor ?? undefined,
            });
            if (res) {
              setMyComments((prev) => [...prev, ...res.items]);
              setNextCursor(res.nextCursor);
              setHasMore(res.hasMore);
            }
          } else if (source === "scrap") {
            const res = await getMyScrappedCommunity({
              limit: 8,
              cursor: nextCursor ?? undefined,
            });
            if (res) {
              setScrappedCommunity((prev) => [...prev, ...res.items]);
              setNextCursor(res.nextCursor);
              setHasMore(res.hasMore);
            }
          } else if (source === "like") {
            const res = await getMyLikedCommunity({
              limit: 8,
              cursor: nextCursor ?? undefined,
            });
            if (res) {
              setLikedCommunity((prev) => {
                const seen = new Set(prev.map((item) => item.likeId));
                const appended = res.items.filter((item) => !seen.has(item.likeId));
                return [...prev, ...appended];
              });
              setNextCursor(res.nextCursor);
              setHasMore(res.hasMore);
            }
          } else {
            const res = await getMyPosts({
              limit: 8,
              communityCursor: nextCursor ?? undefined,
            });
            if (res) {
              setMyCommunityPosts((prev) => [...prev, ...res.community.items]);
              setNextCursor(res.community.nextCursor);
              setHasMore(res.community.hasMore);
            }
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
        ListEmptyComponent={
          <EmptyState message={getEmptyMessage()} />
        }
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

export default MyActivityListScreen;
