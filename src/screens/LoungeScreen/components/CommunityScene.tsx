import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View, Text } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../styles";
import CommunityCard from "./CommunityCard";
import SelectableTag from "../../../components/SelectableTag/SelectableTag";
import { RootRoutes } from "../../../navigations/routes";
import { getCommunityCategories, getCommunityList } from "../../../lib/apis/community/communityApi";
import type { CommunityCategory, CommunityListItem } from "../../../lib/apis/community/types";

type TagOption =
  | "전체"
  | "자유게시판"
  | "구인"
  | "입시정보"
  | "유학정보"
  | "학원 운영"
  | "학원/연습실 매매";

const TAG_OPTIONS: TagOption[] = [
  "전체",
  "자유게시판",
  "구인",
  "입시정보",
  "유학정보",
  "학원 운영",
  "학원/연습실 매매",
];

type PostTag = Exclude<TagOption, "전체">;

const CommunityScene = () => {
  const [selectedTag, setSelectedTag] = useState<TagOption>("전체");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [items, setItems] = useState<CommunityListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

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

  const findCategoryIdByTag = (tag: TagOption): string | undefined => {
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

  const loadCommunities = async (opts?: { append?: boolean }) => {
    try {
      setError(null);
      setLoading(true);

      const categoryId = findCategoryIdByTag(selectedTag);
      const res = await getCommunityList({
        categoryId,
      });

      if (!res) {
        setError("커뮤니티 목록을 불러오지 못했습니다.");
        return;
      }

      const nextItems = Array.isArray(res) ? res : [];
      setItems(nextItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const cats = await getCommunityCategories();
      if (cats) setCategories(cats);
    })();
  }, []);

  // 포커스되거나 선택된 태그가 바뀔 때마다 목록 다시 불러오기
  useFocusEffect(
    useCallback(() => {
      loadCommunities({ append: false });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTag])
  );

  const renderItem = ({ item }: { item: CommunityListItem }) => {
    const rawCategory = (item as any).category;
    const categoryName =
      typeof rawCategory === "string" ? rawCategory : rawCategory?.name;
    const relativeDate = formatRelativeTime(item.createdAt);

    return (
      <CommunityCard
        tag={selectedTag === "전체" ? categoryName : undefined}
        title={item.title}
        contentPreview={""}
        author={undefined}
        date={relativeDate}
        likes={item.likeCount ?? 0}
        comments={item.commentCount ?? 0}
        views={item.viewCount ?? 0}
        onPress={() =>
          navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
            communityId: item.communityId,
          })
        }
      />
    );
  };

  return (
    <View style={styles.newsSceneContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={localStyles.tagScroll}
        contentContainerStyle={styles.sortFilterContainer}
        nestedScrollEnabled
        directionalLockEnabled
        scrollEventThrottle={16}
        bounces={false}
      >
        {TAG_OPTIONS.map((tag) => (
          <SelectableTag
            key={tag}
            label={tag}
            selected={selectedTag === tag}
            onPress={() => setSelectedTag(tag)}
          />
        ))}
      </ScrollView>
      {error ? (
        <View style={localStyles.loaderContainer}>
          <Text>{error}</Text>
        </View>
      ) : loading && (!Array.isArray(items) || items.length === 0) ? (
        <View style={localStyles.loaderContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.communityId}
          renderItem={renderItem}
          contentContainerStyle={localStyles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
        />
      )}
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
    return `${hours}시간 전`;
  }
  if (diffMs < monthMs) {
    const days = Math.floor(diffMs / dayMs);
    return `${days}일 전`;
  }
  if (diffMs < yearMs) {
    const months = Math.floor(diffMs / monthMs);
    return `${months}달 전`;
  }
  const years = Math.floor(diffMs / yearMs);
  return `${years}년 전`;
}

const localStyles = StyleSheet.create({
  tagScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  listContent: {
    paddingBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
});

export default CommunityScene;
