import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Text,
} from "react-native";
import Animated from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../styles";
import CommunityCard from "./CommunityCard";
import CommunityListSkeleton from "./CommunityListSkeleton";
import type { LoungeCommunityTagOption } from "./LoungeCommunityTagRow";
import { ContentRoutes, RootRoutes } from "../../../navigations/routes";
import { getCommunityCategories, getCommunityList } from "../../../lib/apis/community/communityApi";
import type { CommunityCategory, CommunityListItem } from "../../../lib/apis/community/types";
import { pickCommunityListImageUrls } from "../../../lib/media/listThumbnailUrl";
import {
  pickCommunityAuthor,
  pickCommunityAuthorActivityName,
  pickCommunityAuthorUserId,
  pickCommunityProfileImgUrl,
} from "../../../lib/community/communityAuthor";
import { GRAY, MAIN } from "../../../color";
import { useLoungeScroll } from "../LoungeScrollContext";
import { useAuth } from "../../../contexts/AuthContext";

type PostTag = Exclude<LoungeCommunityTagOption, "전체">;

type CommunitySceneProps = {
  selectedTag: LoungeCommunityTagOption;
};

const PAGE_LIMIT = 8;

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<CommunityListItem>,
);

const CommunityScene = ({ selectedTag }: CommunitySceneProps) => {
  const { listTopInset, communityScrollHandler, setCommunityListRef } =
    useLoungeScroll();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [items, setItems] = useState<CommunityListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";

  const filteredPosts = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : [];
    if (selectedTag === "전체") return safeItems;

    const categoryNameByTag: Record<PostTag, string> = {
      자유게시판: "자유게시판",
      구인: "구인",
      입시정보: "입시정보",
      유학정보: "유학정보",
      "학원 운영": "학원운용",
      "학원/연습실 매매": "학원/연습실 매매",
    };

    const targetName = categoryNameByTag[selectedTag as PostTag];
    if (!targetName) return safeItems;
    return safeItems.filter((item) => {
      const cat = (item as any).category;
      const catName = typeof cat === "string" ? cat : cat?.name;
      return catName === targetName;
    });
  }, [items, selectedTag]);

  const findCategoryIdByTag = (tag: LoungeCommunityTagOption): string | undefined => {
    if (tag === "전체") return undefined;

    const categoryNameByTag: Record<PostTag, string> = {
      자유게시판: "자유게시판",
      구인: "구인",
      입시정보: "입시정보",
      유학정보: "유학정보",
      "학원 운영": "학원운용",
      "학원/연습실 매매": "학원/연습실 매매",
    };

    const name = categoryNameByTag[tag as PostTag];
    if (!name) return undefined;
    const category = categories.find((c) => c.name === name);
    return category?.categoryId;
  };

  const loadCommunities = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    try {
      setError(null);
      if (mode === "refresh") {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const categoryId = findCategoryIdByTag(selectedTag);
      const res = await getCommunityList({
        categoryId,
        limit: PAGE_LIMIT,
      });

      if (!res) {
        setError("커뮤니티 목록을 불러오지 못했습니다.");
        return;
      }

      setItems(res.items);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } finally {
      if (mode === "refresh") {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [categories, selectedTag]);

  const onRefresh = useCallback(() => {
    void loadCommunities("refresh");
  }, [loadCommunities]);

  const onEndReached = useCallback(async () => {
    if (!hasMore || !nextCursor || loadingMore || loading || refreshing) return;
    setLoadingMore(true);
    try {
      const categoryId = findCategoryIdByTag(selectedTag);
      const res = await getCommunityList({
        categoryId,
        cursor: nextCursor,
        limit: PAGE_LIMIT,
      });
      if (!res) return;
      setItems((prev) => [...prev, ...res.items]);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, nextCursor, loadingMore, loading, refreshing, categories, selectedTag]);

  useEffect(() => {
    (async () => {
      const cats = await getCommunityCategories();
      if (cats) setCategories(cats);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadCommunities();
    }, [loadCommunities]),
  );

  const navigateToAuthorProfile = useCallback(
    (authorUserId?: string, activityName?: string) => {
      const uid = authorUserId?.trim();
      if (!uid) return;

      if (myUserId && uid.toLowerCase() === myUserId.toLowerCase()) {
        navigation.navigate(RootRoutes.CONTENT_TAB, {
          screen: ContentRoutes.LOUNGE,
        });
        return;
      }

      navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
        userId: uid,
        activityName: activityName?.trim() ?? "",
      });
    },
    [myUserId, navigation],
  );

  const renderItem = ({ item }: { item: CommunityListItem }) => {
    const relativeDate = formatRelativeTime(item.createdAt);
    const author = pickCommunityAuthor(item);
    const authorUserId = pickCommunityAuthorUserId(item);
    const isOwnPost = Boolean(
      myUserId && authorUserId && authorUserId.toLowerCase() === myUserId.toLowerCase(),
    );

    const categoryTag =
      typeof item.category === "string" ? item.category : item.category?.name;

    return (
      <CommunityCard
        communityId={item.communityId}
        tag={categoryTag}
        title={item.title}
        contentPreview={item.content ?? ""}
        author={author}
        activityName={pickCommunityAuthorActivityName(item)}
        profileImageUrl={pickCommunityProfileImgUrl(item)}
        showAvatar
        date={relativeDate}
        likes={item.likeCount ?? 0}
        comments={item.commentCount ?? 0}
        scraps={item.scrapCount ?? 0}
        views={item.viewCount}
        images={pickCommunityListImageUrls(item)}
        authorUserId={authorUserId}
        isOwnPost={isOwnPost}
        onPress={() =>
          navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
            communityId: item.communityId,
          })
        }
        onPressAuthor={
          authorUserId
            ? () => navigateToAuthorProfile(authorUserId, author)
            : undefined
        }
      />
    );
  };

  return (
    <View style={styles.newsSceneContainer}>
      <AnimatedFlatList
        ref={setCommunityListRef}
        data={filteredPosts}
        keyExtractor={(item) => item.communityId}
        renderItem={renderItem}
        contentContainerStyle={[
          localStyles.listContent,
          { paddingTop: listTopInset },
        ]}
        style={localStyles.sectionList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        onScroll={communityScrollHandler}
        scrollEventThrottle={16}
        onEndReached={() => void onEndReached()}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MAIN.DEFAULT}
            colors={[MAIN.DEFAULT]}
            progressViewOffset={listTopInset}
          />
        }
        ListEmptyComponent={
          (loading || error) && !refreshing ? (
            <CommunityListSkeleton />
          ) : (
            <View style={localStyles.loaderContainer}>
              <Text style={localStyles.emptyText}>게시글이 없습니다.</Text>
            </View>
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={localStyles.loaderContainer}>
              <Text style={localStyles.emptyText}>불러오는 중…</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

function formatRelativeTime(createdAt?: string): string {
  if (!createdAt) return "";

  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return "";

  const diffMs = Date.now() - created.getTime();
  if (diffMs < 0) return "방금 전";

  const hourMs = 1000 * 60 * 60;
  const dayMs = hourMs * 24;
  const monthMs = dayMs * 30;
  const yearMs = dayMs * 365;

  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.floor(diffMs / hourMs));
    return `${hours}시간`;
  }
  if (diffMs < monthMs) {
    const days = Math.floor(diffMs / dayMs);
    return `${days}일`;
  }
  if (diffMs < yearMs) {
    const months = Math.floor(diffMs / monthMs);
    return `${months}달`;
  }
  const years = Math.floor(diffMs / yearMs);
  return `${years}년`;
}

const localStyles = StyleSheet.create({
  sectionList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY.DARK,
  },
});

export default CommunityScene;
