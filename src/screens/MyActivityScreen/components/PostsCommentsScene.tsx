import { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import Section from "../../../components/Section/Section";
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

const PostsCommentsScene = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("작성글");
  const data = selectedFilter === "작성글" ? MOCK_POSTS : [];
  const communitySectionTitle = selectedFilter === "작성글" ? "커뮤니티" : "댓글";

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
      <Section
        title={communitySectionTitle}
        onPressMore={() => {}}
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
            <Text style={styles.emptyText}>
              {selectedFilter === "작성글" ? "작성한 글이 없습니다." : "작성한 댓글이 없습니다."}
            </Text>
          </View>
        )}
      </Section>
      <Section
        title="공연 소식"
        onPressMore={() => {}}
        styles={{ content: { paddingHorizontal: 0 } }}
      >
        <ImageScrollView
          styles={{ container: {} }}
          width={138}
          height={264}
          gap={14}
          type="withText"
        />
      </Section>
    </ScrollView>
  );
};

export default PostsCommentsScene;
