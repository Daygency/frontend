import { FlatList, View, Text, StyleSheet } from "react-native";
import ReviewCard from "../../../../components/ReviewCard/ReviewCard";
import styles from "../styles";

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

const MOCK_REVIEWS = [
  {
    id: "1",
    author: "이XX",
    date: "2025.09.20",
    title: "2025년 봄 정기 연주회",
    content:
      "매우 프로페셔널하고 연주 실력이 뛰어나십니다. 함께 작업하기 편했고 결과물도 훌륭했습니다.",
    reactionTag: "감동했어요 😊",
  },
  {
    id: "2",
    author: "이XX",
    date: "2025.09.18",
    title: "2025년 봄 정기 연주회",
    reactionTag: "감동했어요 😊",
  },
];

const MyReviewsScene = () => {
  return (
    <View style={styles.postsCommentsContainer}>
      <View style={localStyles.topSpacer} />
      <FlatList
        style={{ flex: 1 }}
        data={MOCK_REVIEWS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <View style={localStyles.cardWrapper}>
          <ReviewCard
            author={item.author}
            date={item.date}
            title={item.title}
            content={item.content}
            reactionTag={item.reactionTag}
            onOptionsPress={() => {}}
          />
        </View>
        )}
        contentContainerStyle={localStyles.listContent}
        ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>작성한 후기가 없습니다.</Text>
        </View>
        }
      />
    </View>
  );
};

export default MyReviewsScene;
