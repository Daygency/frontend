import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import CommunityCard from "./CommunityCard";
import SelectableTag from "../../../components/SelectableTag/SelectableTag";
import { RootRoutes } from "../../../navigations/routes";

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

type CommunityPost = {
  id: string;
  tag: PostTag;
  title: string;
  contentPreview: string;
  author?: string;
  date: string;
  likes: number;
  comments: number;
  scraps: number;
};

// TODO: API 연동 시 실제 데이터로 대체
const MOCK_POSTS: CommunityPost[] = [
  {
    id: "1",
    tag: "구인",
    title: "교향악단 바이올린 객원단원 채용",
    contentPreview: "너무 떨렸는데 관객분들 반응이 좋아서 기분이 좋네",
    author: "알수없음",
    date: "2025.11.20",
    likes: 45,
    comments: 5,
    scraps: 45,
  },
  {
    id: "2",
    tag: "자유게시판",
    title: "실내악 앙상블 멤버 구합니다",
    contentPreview: "정기적으로 모여 연습하고 공연할 팀원을 찾고 있어요.",
    author: "김연주",
    date: "2025.10.02",
    likes: 12,
    comments: 3,
    scraps: 7,
  },
  {
    id: "3",
    tag: "입시정보",
    title: "입시 레슨 같이 준비하실 분",
    contentPreview: "서울권 음대 목표로 하는 수험생들과 스터디 겸 레슨 구해요.",
    author: "알수없음",
    date: "2025.09.15",
    likes: 30,
    comments: 10,
    scraps: 18,
  },
];

const CommunityScene = () => {
  const [selectedTag, setSelectedTag] = useState<TagOption>("전체");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const filteredPosts = useMemo(() => {
    if (selectedTag === "전체") return MOCK_POSTS;
    return MOCK_POSTS.filter((post) => post.tag === selectedTag);
  }, [selectedTag]);

  // 태그 변경 시 로딩 스피너를 잠깐 보여줌
  // 추후 실제 API 연동 시 이 부분에 fetch 로직을 넣고
  // 응답 받은 후 setLoading(false)를 호출하면 됨.
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [selectedTag]);

  const renderItem = ({ item }: { item: CommunityPost }) => {
    return (
      <CommunityCard
        title={item.title}
        contentPreview={item.contentPreview}
        author={item.author}
        date={item.date}
        likes={item.likes}
        comments={item.comments}
        scraps={item.scraps}
        onPress={() =>
          navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
            post: item,
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
      {loading ? (
        <View style={localStyles.loaderContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={localStyles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
        />
      )}
    </View>
  );
};

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
