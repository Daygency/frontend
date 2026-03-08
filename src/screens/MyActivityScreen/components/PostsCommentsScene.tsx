import { useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Section from "../../../components/Section/Section";
import { RootRoutes } from "../../../navigations/routes";
import ImageScrollView from "../../../components/ImageScrollView/ImageScrollView";
import CommunityCard from "../../LoungeScreen/components/CommunityCard";
import SelectableTag from "../../../components/SelectableTag/SelectableTag";
import styles from "../styles";

type FilterOption = "작성글" | "댓글";

const MOCK_POSTS = [
  {
    id: "1",
    title: "교향악단 바이올린 객원단원 채용",
    contentPreview: "너무 떨렸는데 관객분들 반응이 좋아서 기분이 좋네",
    author: "신바이올린",
    date: "2025.11.20",
    likes: 45,
    comments: 5,
    scraps: 45,
  },
];

const MOCK_COMMENTS = [
  {
    id: "c1",
    title: "오늘 공연 후기 모음",
    contentPreview: "다들 수고 많으셨습니다! 다음 공연도 기대됩니다",
    author: "관람객A",
    date: "2025.11.18",
    likes: 32,
    comments: 12,
    scraps: 8,
  },
];

type RootStackParamList = {
  MyActivityList: { type: "posts" | "comments" };
  MyActivityNewsList: undefined;
};

const PostsCommentsScene = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("작성글");
  const postsData = selectedFilter === "작성글" ? MOCK_POSTS : [];
  const commentsData = selectedFilter === "댓글" ? MOCK_COMMENTS : [];

  const handlePressCommunity = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_LIST, {
      type: selectedFilter === "작성글" ? "posts" : "comments",
    });
  };

  const handlePressNews = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_NEWS_LIST);
  };

  const renderContentSection = (
    title: string,
    data: typeof MOCK_POSTS,
    emptyMessage: string,
    onPressMore: () => void
  ) => (
    <Section
      title={title}
      onPressMore={onPressMore}
      styles={{ content: { paddingHorizontal: 0 } }}
    >
      {data.length > 0 ? (
        data.map((item) => (
          <CommunityCard
            key={item.id}
            title={item.title}
            contentPreview={item.contentPreview}
            author={item.author}
            date={item.date}
            likes={item.likes}
            comments={item.comments}
            scraps={item.scraps}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      )}
    </Section>
  );

  const renderNewsSection = (scrollKey: string) => (
    <Section
      title="공연 소식"
      onPressMore={handlePressNews}
      styles={{ content: { paddingHorizontal: 0 } }}
    >
      <ImageScrollView
        key={scrollKey}
        styles={{ container: {} }}
        width={138}
        height={264}
        gap={14}
        type="withText"
      />
    </Section>
  );

  return (
    <ScrollView
      style={styles.postsCommentsContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sortFilterContainer}>
        <SelectableTag
          label="작성글"
          selected={selectedFilter === "작성글"}
          onPress={() => setSelectedFilter("작성글")}
        />
        <SelectableTag
          label="댓글"
          selected={selectedFilter === "댓글"}
          onPress={() => setSelectedFilter("댓글")}
        />
      </View>

      {/* 작성글: 작성글과 공연 소식 각각 별도 스크롤 상태 유지 */}
      <View style={selectedFilter === "작성글" ? undefined : localStyles.hidden}>
        {renderContentSection(
          "커뮤니티",
          postsData,
          "작성한 글이 없습니다.",
          handlePressCommunity
        )}
        {renderNewsSection("posts")}
      </View>

      {/* 댓글: 댓글 단 글과 공연 소식 각각 별도 스크롤 상태 유지 */}
      <View style={selectedFilter === "댓글" ? undefined : localStyles.hidden}>
        {renderContentSection(
          "커뮤니티",
          commentsData,
          "작성한 댓글이 없습니다.",
          handlePressCommunity
        )}
        {renderNewsSection("comments")}
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  hidden: {
    display: "none",
  },
});

export default PostsCommentsScene;
