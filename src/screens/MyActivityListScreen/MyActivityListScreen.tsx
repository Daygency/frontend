import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CommunityCard from "../LoungeScreen/components/CommunityCard";
import styles from "./styles";
import { RootRoutes } from "../../navigations/routes";
import { getMyPosts, getMyComments } from "../../lib/apis/userPosts/myPostsApi";
import type { MyCommunityPostItem, MyCommentPostItem } from "../../lib/apis/userPosts/types";
import { getMyScrappedCommunity } from "../../lib/apis/scrap/scrapApi";
import type { MyScrappedCommunityItem } from "../../lib/apis/scrap/types";
import { normalizeListThumbnailUrl } from "../../lib/media/listThumbnailUrl";

type MyActivityListParams = {
  type: "posts" | "comments";
  source?: "scrap";
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
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (type !== "posts" || source === "scrap") return;
    (async () => {
      const res = await getMyPosts();
      if (!res) {
        setMyCommunityPosts([]);
        return;
      }
      setMyCommunityPosts(res.community);
    })();
  }, [type, source]);

  useEffect(() => {
    if (type !== "comments") return;
    (async () => {
      const res = await getMyComments();
      setMyComments(res ?? []);
    })();
  }, [type]);

  useEffect(() => {
    if (type !== "posts" || source !== "scrap") return;
    (async () => {
      const res = await getMyScrappedCommunity({ limit: 20 });
      if (!res) {
        setScrappedCommunity([]);
        setNextCursor(null);
        setHasMore(false);
        return;
      }
      setScrappedCommunity(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    })();
  }, [type, source]);

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

  const data: CommunityRow[] =
    type === "posts"
      ? source === "scrap"
        ? scrappedPostsData
        : myPostsData
      : myCommentsData;

  const getEmptyMessage = () => {
    if (source === "scrap") return "스크랩한 글이 없습니다.";
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
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.4}
        onEndReached={async () => {
          if (type !== "posts" || source !== "scrap" || loadingMore || !hasMore) return;
          setLoadingMore(true);
          const res = await getMyScrappedCommunity({
            limit: 20,
            cursor: nextCursor ?? undefined,
          });
          if (res) {
            setScrappedCommunity((prev) => [...prev, ...res.items]);
            setNextCursor(res.nextCursor);
            setHasMore(res.hasMore);
          }
          setLoadingMore(false);
        }}
        ListFooterComponent={
          type === "posts" && source === "scrap" && loadingMore ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>불러오는 중...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
          </View>
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
